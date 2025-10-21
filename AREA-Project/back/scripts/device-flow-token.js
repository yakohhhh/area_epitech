#!/usr/bin/env node

/**
 * Script utilisant Google Device Flow pour obtenir un refresh token automatiquement
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

async function makeHttpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function startDeviceFlow() {
  const postData = querystring.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: SCOPES.join(' ')
  });

  const options = {
    hostname: 'oauth2.googleapis.com',
    port: 443,
    path: '/device/code',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return await makeHttpsRequest(options, postData);
}

async function pollForTokens(deviceCode, interval) {
  const postData = querystring.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    device_code: deviceCode,
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
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

  return await makeHttpsRequest(options, postData);
}

async function updateEnvFile(refreshToken) {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Remplacer le refresh token
  envContent = envContent.replace(
    /GOOGLE_REFRESH_TOKEN=.*/,
    `GOOGLE_REFRESH_TOKEN=${refreshToken}`
  );
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env mis à jour avec le nouveau refresh token');
}

async function main() {
  try {
    console.log('🚀 Démarrage du processus d\'authentification Google Device Flow...\n');

    // Étape 1: Démarrer le Device Flow
    const deviceResponse = await startDeviceFlow();
    
    if (deviceResponse.error) {
      throw new Error(`Device Flow Error: ${deviceResponse.error_description || deviceResponse.error}`);
    }

    console.log('📱 Authentification Google requise:');
    console.log(`🔗 Ouvrez cette URL: ${deviceResponse.verification_url}`);
    console.log(`🔑 Entrez ce code: ${deviceResponse.user_code}`);
    console.log(`⏱️  Vous avez ${Math.floor(deviceResponse.expires_in / 60)} minutes pour compléter l'authentification\n`);

    // Étape 2: Attendre l'autorisation
    console.log('⏳ En attente de votre autorisation...');
    
    const pollInterval = (deviceResponse.interval || 5) * 1000;
    let attempts = 0;
    const maxAttempts = Math.floor(deviceResponse.expires_in / (pollInterval / 1000));

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;

      try {
        const tokenResponse = await pollForTokens(deviceResponse.device_code, pollInterval);
        
        if (tokenResponse.error) {
          if (tokenResponse.error === 'authorization_pending') {
            process.stdout.write('.');
            continue;
          } else if (tokenResponse.error === 'slow_down') {
            console.log('\n⚠️  Ralentissement du polling...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          } else {
            throw new Error(`Token Error: ${tokenResponse.error_description || tokenResponse.error}`);
          }
        }

        // Succès !
        console.log('\n\n✅ Authentification réussie!');
        console.log('🔑 Refresh token obtenu:', tokenResponse.refresh_token.substring(0, 50) + '...');
        
        // Mettre à jour le fichier .env
        await updateEnvFile(tokenResponse.refresh_token);
        
        console.log('\n🎉 Processus terminé avec succès!');
        console.log('🔄 Le nouveau refresh token a été sauvegardé dans .env');
        console.log('🚀 Redémarrez votre serveur backend pour utiliser le nouveau token');
        
        return;

      } catch (error) {
        if (error.message.includes('authorization_pending') || error.message.includes('slow_down')) {
          continue;
        }
        throw error;
      }
    }

    throw new Error('Timeout: Aucune autorisation reçue dans le délai imparti');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Erreur: GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET doivent être définis dans .env');
    process.exit(1);
  }
  
  main();
}