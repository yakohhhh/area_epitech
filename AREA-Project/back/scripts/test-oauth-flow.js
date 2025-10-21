#!/usr/bin/env node

/**
 * Script pour tester le flow OAuth Google complet
 * Simule la création d'un compte Google et vérifie si le refresh token est stocké
 */

const axios = require('axios');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

async function testGoogleOAuthFlow() {
    console.log('🧪 TEST DU FLOW OAUTH GOOGLE COMPLET');
    console.log('='.repeat(50));

    try {
        console.log('🔗 Étape 1: Génération de l\'URL d\'authentification Google...');

        // Cette étape nécessite un utilisateur connecté, mais pour tester on peut simuler
        console.log('⚠️ Note: Pour un test complet, il faudrait :');
        console.log('   1. Se connecter avec un compte utilisateur normal');
        console.log('   2. Appeler /auth/google/url pour obtenir l\'URL d\'auth');
        console.log('   3. Ouvrir cette URL dans un navigateur');
        console.log('   4. Accepter les permissions Google');
        console.log('   5. Vérifier que les tokens sont stockés en DB');

        console.log('');
        console.log('📋 Instructions pour test manuel :');
        console.log('');
        console.log('1. Dans votre frontend, connectez-vous avec un compte existant');
        console.log('2. Allez dans les paramètres/profile pour connecter Google');
        console.log('3. Acceptez les permissions Gmail, Calendar, Contacts');
        console.log('4. Revenez ici et exécutez : node scripts/check-google-tokens.js');
        console.log('5. Vérifiez que le refresh token est maintenant présent');

        console.log('');
        console.log('🎯 Attendu après connexion Google :');
        console.log('   ✅ OAuth Token: Présent');
        console.log('   ✅ Refresh Token: Présent');
        console.log('   ✅ Email service fonctionne');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error.response ? .data || error.message);
    }
}

// Test de l'envoi d'email avec un utilisateur qui a des tokens
async function testEmailSending(userId) {
    console.log(`📧 Test d'envoi d'email pour l'utilisateur ${userId}...`);

    try {
        const response = await axios.post(`${BACKEND_URL}/email/send`, {
            to: 'test@example.com',
            subject: 'Test Gmail API',
            body: 'Ceci est un test d\'envoi d\'email via Gmail API'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.TEST_JWT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Email envoyé avec succès');
    } catch (error) {
        if (error.response ? .status === 400 && error.response ? .data ? .message ? .includes('tokens manquants')) {
            console.log('❌ Échec: Tokens manquants - L\'utilisateur n\'a pas de tokens Google');
        } else {
            console.log('❌ Erreur lors de l\'envoi:', error.response ? .data || error.message);
        }
    }
}

if (require.main === module) {
    testGoogleOAuthFlow().catch(console.error);
}

module.exports = { testGoogleOAuthFlow, testEmailSending };