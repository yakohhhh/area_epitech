#!/usr/bin/env node

/**
 * Script pour tester le Client ID alternatif et générer un refresh token
 */

require('dotenv').config();

console.log('🔄 TEST DU CLIENT ID ALTERNATIF\n');

// Utiliser le client ID alternatif
const clientId = process.env.GOOGLE_CLIENT_ID_ALT || '99882212083-jbhminrq2hrscjkrnkn01jls5ago95s1.apps.googleusercontent.com';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET_ALT || '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';

console.log('🔑 Configuration alternative:');
console.log(`Client ID: ${clientId}`);
console.log(`Client Secret: ${clientSecret.substring(0, 20)}...`);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly'
];

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${clientId}&` +
  `redirect_uri=http%3A%2F%2Flocalhost%3A5001%2Fauth%2Fgoogle%2Fcallback&` +
  `scope=${encodeURIComponent(scopes.join(' '))}&` +
  `response_type=code&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('\n🌐 URL D\'AUTORISATION ALTERNATIVE:');
console.log('─'.repeat(80));
console.log(authUrl);
console.log('─'.repeat(80));

console.log('\n📋 INSTRUCTIONS:');
console.log('1. Ouvrez l\'URL ci-dessus dans votre navigateur');
console.log('2. Connectez-vous avec keayscops@gmail.com');
console.log('3. Si ça fonctionne, autorisez toutes les permissions');
console.log('4. Copiez le code de l\'URL de redirection');
console.log('5. Exécutez: node scripts/alt-token.js VOTRE_CODE');

// Si un code est fourni
const authCode = process.argv[2];
if (authCode) {
  console.log('\n🔄 Traitement du code avec credentials alternatifs...\n');
  
  const https = require('https');
  const querystring = require('querystring');
  const fs = require('fs');
  const path = require('path');

  const postData = querystring.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:5001/auth/google/callback'
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
          console.error('❌ Erreur:', tokens.error_description || tokens.error);
          return;
        }

        console.log('✅ SUCCÈS! Nouveau refresh token obtenu avec credentials alternatifs!\n');
        
        // Mettre à jour le fichier .env avec les nouveaux credentials
        const envPath = path.join(__dirname, '../.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Remplacer les credentials principaux par les alternatifs qui fonctionnent
        envContent = envContent.replace(
          /GOOGLE_CLIENT_ID=.*/,
          `GOOGLE_CLIENT_ID=${clientId}`
        );
        
        envContent = envContent.replace(
          /GOOGLE_CLIENT_SECRET=.*/,
          `GOOGLE_CLIENT_SECRET=${clientSecret}`
        );
        
        envContent = envContent.replace(
          /GOOGLE_REFRESH_TOKEN=.*/,
          `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
        );
        
        fs.writeFileSync(envPath, envContent);
        
        console.log('📝 Fichier .env mis à jour avec:');
        console.log(`   - Client ID alternatif: ${clientId}`);
        console.log(`   - Client Secret alternatif: ${clientSecret.substring(0, 20)}...`);
        console.log(`   - Nouveau refresh token: ${tokens.refresh_token.substring(0, 50)}...`);
        
        console.log('\n🧪 Test du nouveau token...');
        
        // Test immédiat
        const testData = querystring.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token'
        });

        const testReq = https.request(options, (testRes) => {
          let testResponse = '';
          testRes.on('data', (chunk) => testResponse += chunk);
          testRes.on('end', () => {
            try {
              const testTokens = JSON.parse(testResponse);
              if (testTokens.access_token && !testTokens.error) {
                console.log('✅ Test réussi! Token fonctionnel');
                console.log('\n🎉 PROBLÈME RÉSOLU!');
                console.log('🚀 Redémarrez votre backend et testez dans l\'app mobile');
                console.log('📱 Les intégrations Google devraient maintenant fonctionner');
              } else {
                console.log('⚠️  Problème lors du test:', testResponse);
              }
            } catch (e) {
              console.log('⚠️  Erreur test:', e.message);
            }
          });
        });

        testReq.on('error', (err) => console.log('Erreur test:', err.message));
        testReq.write(testData);
        testReq.end();
        
      } catch (error) {
        console.error('❌ Erreur parsing:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur réseau:', error.message);
  });

  req.write(postData);
  req.end();
} else {
  console.log('\n💡 Si cette URL fonctionne, cela signifie que le projet alternatif');
  console.log('   a keayscops@gmail.com configuré comme utilisateur test.');
}