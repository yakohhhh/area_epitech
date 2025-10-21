#!/usr/bin/env node

/**
 * Script automatique pour obtenir un refresh token Google
 * Démarre un serveur temporaire pour gérer le callback OAuth
 */

const { google } = require('googleapis');
const express = require('express');
const { exec } = require('child_process');
require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly'
];

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/oauth/callback`;

async function getRefreshTokenAuto() {
  return new Promise((resolve, reject) => {
    const app = express();
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    app.get('/oauth/callback', async (req, res) => {
      const { code } = req.query;
      
      if (!code) {
        res.send('❌ Erreur: Aucun code d\'autorisation reçu');
        return reject(new Error('No authorization code received'));
      }

      try {
        const { tokens } = await oauth2Client.getToken(code);
        
        res.send(`
          <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #4CAF50;">✅ Authentification réussie!</h2>
            <p>Refresh token obtenu avec succès.</p>
            <p style="color: #666;">Vous pouvez fermer cette fenêtre.</p>
          </div>
        `);
        
        console.log('\n✅ Tokens obtenus avec succès!');
        console.log('\n📋 Nouveau refresh token:');
        console.log(tokens.refresh_token);
        
        // Fermer le serveur
        server.close();
        resolve(tokens);
        
      } catch (error) {
        res.send(`❌ Erreur: ${error.message}`);
        reject(error);
      }
    });

    const server = app.listen(PORT, () => {
      console.log(`🚀 Génération automatique du refresh token Google...`);
      console.log(`📡 Serveur temporaire démarré sur http://localhost:${PORT}`);
      console.log(`🔗 Ouverture automatique du navigateur...`);
      
      // Ouvrir automatiquement le navigateur
      setTimeout(() => {
        exec(`xdg-open "${authUrl}"`, (error) => {
          if (error) {
            console.log('\n⚠️  Impossible d\'ouvrir automatiquement le navigateur.');
            console.log('🔗 Ouvrez manuellement cette URL:');
            console.log(authUrl);
          } else {
            console.log('🌐 Navigateur ouvert automatiquement');
          }
        });
      }, 1000);
    });

    // Timeout de 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Timeout: Aucune autorisation reçue dans les 5 minutes'));
    }, 5 * 60 * 1000);
  });
}

async function updateEnvFile(refreshToken) {
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Remplacer ou ajouter le refresh token
  if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
    envContent = envContent.replace(
      /GOOGLE_REFRESH_TOKEN=.*/,
      `GOOGLE_REFRESH_TOKEN=${refreshToken}`
    );
  } else {
    envContent += `\nGOOGLE_REFRESH_TOKEN=${refreshToken}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('📝 Fichier .env mis à jour avec le nouveau refresh token');
}

if (require.main === module) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Erreur: GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET doivent être définis dans .env');
    process.exit(1);
  }
  
  getRefreshTokenAuto()
    .then(async (tokens) => {
      await updateEnvFile(tokens.refresh_token);
      console.log('\n🎉 Processus terminé avec succès!');
      console.log('🔄 Redémarrez votre serveur backend pour utiliser le nouveau token');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur:', error.message);
      process.exit(1);
    });
}