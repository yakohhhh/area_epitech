#!/usr/bin/env node

/**
 * Script simple pour obtenir un refresh token Google via API REST
 */

const https = require('https');
const querystring = require('querystring');
require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events', 
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly'
];

function generateAuthUrl() {
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/auth/google/callback',
    scope: SCOPES.join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  };
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(params)}`;
}

async function exchangeCodeForTokens(authCode) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/auth/google/callback'
    });

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tokens = JSON.parse(data);
          if (tokens.error) {
            reject(new Error(`Google API Error: ${tokens.error_description || tokens.error}`));
          } else {
            resolve(tokens);
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testCurrentToken() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/calendar/v3/calendars/primary',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_REFRESH_TOKEN}`
      }
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

async function refreshAccessToken() {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tokens = JSON.parse(data);
          if (tokens.error) {
            reject(new Error(`Refresh Token Error: ${tokens.error_description || tokens.error}`));
          } else {
            resolve(tokens);
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🔍 Vérification du token actuel...\n');

  // Test du refresh token actuel
  try {
    const accessTokens = await refreshAccessToken();
    console.log('✅ Le refresh token actuel fonctionne!');
    console.log('🔑 Nouveau access token généré:', accessTokens.access_token.substring(0, 20) + '...');
    
    // Test avec l'API Calendar
    const testOptions = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/calendar/v3/calendars/primary',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessTokens.access_token}`
      }
    };

    const testResult = await new Promise((resolve) => {
      const req = https.request(testOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', () => resolve({ status: 500, data: 'Network error' }));
      req.end();
    });

    if (testResult.status === 200) {
      console.log('✅ Test Google Calendar réussi!');
      console.log('🎉 Votre token fonctionne correctement pour tous les services.');
      return;
    } else {
      console.log('⚠️  Le token fonctionne mais les scopes sont peut-être insuffisants');
      console.log('📊 Status:', testResult.status);
      console.log('📄 Response:', testResult.data.substring(0, 200) + '...');
    }
    
  } catch (error) {
    console.log('❌ Le refresh token actuel ne fonctionne pas:', error.message);
  }

  console.log('\n🔄 Génération d\'un nouveau refresh token...\n');
  
  const authUrl = generateAuthUrl();
  console.log('🔗 Étapes pour obtenir un nouveau token:');
  console.log('1. Ouvrez cette URL dans votre navigateur:');
  console.log(authUrl);
  console.log('\n2. Autorisez toutes les permissions');
  console.log('3. Copiez le code de l\'URL de callback');
  console.log('4. Relancez ce script avec: node scripts/simple-refresh-token.js CODE_ICI');
  
  // Si un code est fourni en argument
  const authCode = process.argv[2];
  if (authCode) {
    try {
      console.log('\n🔄 Échange du code contre des tokens...');
      const tokens = await exchangeCodeForTokens(authCode);
      
      console.log('✅ Nouveau refresh token obtenu!');
      console.log('📋 Ajoutez cette ligne à votre .env:');
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      
      // Mise à jour automatique du .env
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(__dirname, '../.env');
      
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(
        /GOOGLE_REFRESH_TOKEN=.*/,
        `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Fichier .env mis à jour automatiquement!');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'échange:', error.message);
    }
  }
}

if (require.main === module) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Erreur: GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET doivent être définis dans .env');
    process.exit(1);
  }
  
  main().catch(console.error);
}