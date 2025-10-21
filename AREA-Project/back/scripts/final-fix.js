#!/usr/bin/env node

/**
 * Script final pour résoudre le problème OAuth Google
 * Utilise une approche directe avec les scopes corrects
 */

require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly'
];

// URLs d'autorisation avec tous les scopes nécessaires
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/auth/google/callback')}&` +
  `scope=${encodeURIComponent(SCOPES.join(' '))}&` +
  `response_type=code&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('🔧 SOLUTION DÉFINITIVE POUR LE PROBLÈME OAUTH GOOGLE\n');

console.log('📋 ÉTAPES À SUIVRE:');
console.log('==================');

console.log('\n1️⃣  OUVREZ CETTE URL DANS VOTRE NAVIGATEUR:');
console.log('─'.repeat(60));
console.log(authUrl);
console.log('─'.repeat(60));

console.log('\n2️⃣  AUTORISEZ TOUTES LES PERMISSIONS:');
console.log('   ✅ Google Calendar');
console.log('   ✅ Google Contacts');
console.log('   ⚠️  N\'oubliez aucune permission !');

console.log('\n3️⃣  COPIEZ LE CODE DE L\'URL DE REDIRECTION:');
console.log('   Après autorisation, vous verrez une URL comme:');
console.log('   http://localhost:5001/auth/google/callback?code=VOTRE_CODE&scope=...');
console.log('   👆 Copiez uniquement la partie après "code="');

console.log('\n4️⃣  EXÉCUTEZ CETTE COMMANDE AVEC VOTRE CODE:');
console.log('─'.repeat(60));
console.log('node scripts/final-fix.js COLLEZ_VOTRE_CODE_ICI');
console.log('─'.repeat(60));

// Si un code est fourni
const authCode = process.argv[2];
if (authCode) {
  console.log('\n🔄 Traitement du code d\'autorisation...\n');
  
  const https = require('https');
  const querystring = require('querystring');
  const fs = require('fs');
  const path = require('path');

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
          console.error('❌ Erreur Google API:', tokens.error_description || tokens.error);
          console.log('\n🔄 Réessayez avec une nouvelle URL d\'autorisation:');
          console.log('node scripts/final-fix.js');
          return;
        }

        console.log('✅ SUCCÈS! Nouveau refresh token obtenu!\n');
        
        // Mettre à jour le fichier .env
        const envPath = path.join(__dirname, '../.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        envContent = envContent.replace(
          /GOOGLE_REFRESH_TOKEN=.*/,
          `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
        );
        
        fs.writeFileSync(envPath, envContent);
        
        console.log('📝 Fichier .env mis à jour automatiquement');
        console.log(`🔑 Nouveau refresh token: ${tokens.refresh_token.substring(0, 50)}...`);
        
        // Test immédiat du nouveau token
        console.log('\n🧪 Test du nouveau token...');
        
        const testData = querystring.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token'
        });

        const testOptions = {
          hostname: 'oauth2.googleapis.com',
          port: 443,
          path: '/token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(testData)
          }
        };

        const testReq = https.request(testOptions, (testRes) => {
          let testResponse = '';
          testRes.on('data', (chunk) => testResponse += chunk);
          testRes.on('end', () => {
            try {
              const testTokens = JSON.parse(testResponse);
              if (testTokens.access_token) {
                console.log('✅ Test réussi! Le nouveau token fonctionne parfaitement');
                console.log('\n🎉 PROBLÈME RÉSOLU!');
                console.log('🚀 Redémarrez votre serveur backend pour utiliser le nouveau token');
                console.log('📱 Testez dans l\'app mobile - toutes les intégrations devraient fonctionner');
              } else {
                console.log('⚠️  Token généré mais test échoué:', testResponse);
              }
            } catch (e) {
              console.log('⚠️  Erreur lors du test:', e.message);
            }
          });
        });

        testReq.on('error', (err) => console.log('⚠️  Erreur test:', err.message));
        testReq.write(testData);
        testReq.end();
        
      } catch (error) {
        console.error('❌ Erreur lors du parsing:', error.message);
        console.log('📄 Réponse brute:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur réseau:', error.message);
  });

  req.write(postData);
  req.end();
}