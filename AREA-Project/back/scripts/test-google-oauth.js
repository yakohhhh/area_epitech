#!/usr/bin/env node

/**
 * Script pour tester si les credentials Google OAuth fonctionnent
 * après avoir ajouté un testeur
 */

const { google } = require('googleapis');
require('dotenv').config();

async function testGoogleCredentials() {
    console.log('🧪 TEST DES CREDENTIALS GOOGLE OAUTH');
    console.log('='.repeat(50));

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret) {
        console.log('❌ Erreur: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET manquant dans .env');
        process.exit(1);
    }

    console.log('🔑 Client ID:', clientId.substring(0, 20) + '...');
    console.log('🔗 Redirect URI:', redirectUri);

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    );

    // Générer une URL d'autorisation de test
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ],
        prompt: 'consent'
    });

    console.log('\n🔗 URL DE TEST:');
    console.log(authUrl);

    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Ouvrez l\'URL ci-dessus dans votre navigateur');
    console.log('2. Vous devriez pouvoir vous connecter sans erreur "access_denied"');
    console.log('3. Si ça marche, les credentials sont corrects !');

    console.log('\n⚠️  NOTE: Cette URL ne fait qu\'un test d\'autorisation basique.');
    console.log('Pour les scopes complets (Gmail, Calendar), utilisez l\'app réelle.');
}

if (require.main === module) {
    testGoogleCredentials().catch(console.error);
}