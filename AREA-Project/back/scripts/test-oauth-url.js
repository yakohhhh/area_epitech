#!/usr/bin/env node

/**
 * Script pour tester l'endpoint /auth/google/url qui génère l'URL d'authentification Google
 * avec les bons paramètres pour obtenir un refresh_token
 */

const axios = require('axios');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';
const TEST_USER_TOKEN = process.env.TEST_USER_JWT || 'your-jwt-token-here'; // À remplacer par un vrai token JWT

async function testGoogleAuthUrl() {
    console.log('🧪 TEST DE L\'ENDPOINT /auth/google/url');
    console.log('='.repeat(50));

    try {
        console.log('🔗 Test de l\'URL d\'authentification Google...');

        const response = await axios.get(`${BACKEND_URL}/auth/google/url`, {
            headers: {
                'Authorization': `Bearer ${TEST_USER_TOKEN}`
            }
        });

        const { authUrl } = response.data;
        console.log('✅ URL d\'authentification générée:');
        console.log(authUrl);
        console.log('');

        // Vérifier que l'URL contient les paramètres requis
        const url = new URL(authUrl);

        console.log('🔍 Vérification des paramètres OAuth:');
        console.log('Client ID:', url.searchParams.get('client_id') ? '✅ Présent' : '❌ Manquant');
        console.log('Redirect URI:', url.searchParams.get('redirect_uri') ? '✅ Présent' : '❌ Manquant');
        console.log('Response Type:', url.searchParams.get('response_type') === 'code' ? '✅ Correct (code)' : '❌ Incorrect');
        console.log('Scope:', url.searchParams.get('scope') ? '✅ Présent' : '❌ Manquant');
        console.log('Access Type:', url.searchParams.get('access_type') === 'offline' ? '✅ Correct (offline)' : '❌ Incorrect ou manquant');
        console.log('Prompt:', url.searchParams.get('prompt') === 'consent' ? '✅ Correct (consent)' : '❌ Incorrect ou manquant');
        console.log('State:', url.searchParams.get('state') ? '✅ Présent (JWT)' : '❌ Manquant');

        // Vérifier les scopes Gmail
        const scope = url.searchParams.get('scope');
        const hasGmailSend = scope && scope.includes('https://www.googleapis.com/auth/gmail.send');
        console.log('Scope Gmail Send:', hasGmailSend ? '✅ Présent' : '❌ Manquant');

        console.log('');
        console.log('🎯 Pour tester:');
        console.log('1. Copiez l\'URL ci-dessus dans votre navigateur');
        console.log('2. Connectez-vous avec un compte Google');
        console.log('3. Acceptez les permissions');
        console.log('4. Vous serez redirigé vers le frontend avec les tokens stockés en BDD');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error.response ? .data || error.message);

        if (error.response ? .status === 401) {
            console.log('💡 Conseil: Vérifiez que TEST_USER_JWT est un token JWT valide dans le .env');
        }
    }
}

// Fonction pour obtenir un token JWT de test (login)
async function getTestToken() {
    try {
        console.log('🔑 Obtention d\'un token JWT de test...');

        const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: process.env.TEST_USER_EMAIL || 'test@example.com',
            password: process.env.TEST_USER_PASSWORD || 'password123'
        });

        const token = loginResponse.data.access_token;
        console.log('✅ Token JWT obtenu');
        return token;
    } catch (error) {
        console.log('⚠️ Impossible d\'obtenir un token automatiquement, utilisez TEST_USER_JWT dans .env');
        return null;
    }
}

async function main() {
    // Essayer d'obtenir un token automatiquement, sinon utiliser celui du .env
    let token = await getTestToken();
    if (!token) {
        token = TEST_USER_TOKEN;
    }

    if (!token || token === 'your-jwt-token-here') {
        console.log('❌ Aucun token JWT valide trouvé.');
        console.log('💡 Ajoutez TEST_USER_JWT=your-actual-jwt-token dans le .env');
        console.log('   Ou créez un utilisateur de test et configurez TEST_USER_EMAIL/TEST_USER_PASSWORD');
        process.exit(1);
    }

    // Remplacer le token dans l'env pour le test
    process.env.TEST_USER_JWT = token;

    await testGoogleAuthUrl();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testGoogleAuthUrl, getTestToken };