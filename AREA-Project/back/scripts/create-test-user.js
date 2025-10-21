#!/usr/bin/env node

/**
 * Script pour créer un utilisateur de test et obtenir un token JWT
 */

const axios = require('axios');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

async function createTestUser() {
    console.log('👤 CRÉATION D\'UN UTILISATEUR DE TEST');
    console.log('='.repeat(50));

    try {
        const testUser = {
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser'
        };

        console.log('📝 Tentative de création d\'un utilisateur de test...');
        const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, testUser);
        console.log('✅ Utilisateur créé:', registerResponse.data);

        return testUser;
    } catch (error) {
        console.error('❌ Erreur détaillée lors de la création:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }

        if (error.response ? .status === 409) {
            console.log('ℹ️ Utilisateur existe déjà, tentative de connexion...');
            return { email: 'test@example.com', password: 'password123' };
        } else {
            throw error;
        }
    }
}

async function loginTestUser(user) {
    try {
        console.log('🔑 Connexion de l\'utilisateur de test...');
        const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: user.email,
            password: user.password
        });

        const token = loginResponse.data.access_token;
        console.log('✅ Token JWT obtenu:', token.substring(0, 20) + '...');

        return token;
    } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error.response ? .data || error.message);
        throw error;
    }
}

async function main() {
    try {
        const user = await createTestUser();
        const token = await loginTestUser(user);

        console.log('');
        console.log('🎯 Token JWT pour les tests:');
        console.log(token);
        console.log('');
        console.log('💡 Ajoutez ceci dans votre .env:');
        console.log(`TEST_USER_JWT=${token}`);

    } catch (error) {
        console.error('❌ Échec de la création/obtention du token:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { createTestUser, loginTestUser };