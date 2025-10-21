#!/usr/bin/env node

/**
 * Script pour obtenir un nouveau refresh token Google avec tous les scopes nécessaires
 * Usage: node scripts/get-google-refresh-token.js
 */

const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/gmail.send'
];

async function getRefreshToken() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:5001/auth/google/callback' // Ou votre redirect URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });

    console.log('🔗 Ouvrez cette URL dans votre navigateur:');
    console.log(authUrl);
    console.log('\n📝 Après avoir autorisé l\'application, vous serez redirigé vers une URL.');
    console.log('🔑 Copiez le paramètre "code" de l\'URL et collez-le ci-dessous:\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question('Entrez le code d\'autorisation: ', async(code) => {
            rl.close();

            try {
                const { tokens } = await oauth2Client.getToken(code);
                console.log('\n✅ Tokens obtenus avec succès!');
                console.log('\n📋 Ajoutez ces variables à votre fichier .env:');
                console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
                console.log(`GOOGLE_ACCESS_TOKEN=${tokens.access_token}`);

                if (tokens.expiry_date) {
                    console.log(`# Token expire le: ${new Date(tokens.expiry_date).toISOString()}`);
                }

                console.log('\n🔄 Le refresh_token peut être utilisé pour obtenir de nouveaux access_tokens');
                console.log('🔐 Gardez ces tokens secrets et ne les partagez jamais!');

                resolve(tokens);
            } catch (error) {
                console.error('❌ Erreur lors de l\'obtention des tokens:', error.message);
                reject(error);
            }
        });
    });
}

if (require.main === module) {
    console.log('🚀 Génération d\'un nouveau refresh token Google...\n');

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error('❌ Erreur: GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET doivent être définis dans .env');
        process.exit(1);
    }

    getRefreshToken()
        .then(() => {
            console.log('\n🎉 Processus terminé avec succès!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Erreur:', error);
            process.exit(1);
        });
}