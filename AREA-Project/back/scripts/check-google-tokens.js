#!/usr/bin/env node

/**
 * Script pour vérifier l'état des tokens Google dans la DB
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkGoogleTokens() {
    console.log('🔍 VÉRIFICATION DES TOKENS GOOGLE EN DB');
    console.log('='.repeat(50));

    try {
        // Trouver tous les utilisateurs Gmail
        const gmailUsers = await prisma.user.findMany({
            where: {
                email: {
                    contains: 'gmail.com'
                }
            },
            include: {
                userServices: {
                    include: {
                        service: true
                    }
                }
            }
        });

        console.log(`📧 Utilisateurs Gmail trouvés: ${gmailUsers.length}`);
        console.log('');

        for (const user of gmailUsers) {
            console.log(`👤 Utilisateur: ${user.username} (${user.email}) - ID: ${user.id}`);
            console.log(`   Créé le: ${user.createdAt}`);

            if (user.userServices.length === 0) {
                console.log('   ❌ Aucun service connecté');
            } else {
                console.log('   🔗 Services connectés:');
                for (const userService of user.userServices) {
                    console.log(`      - ${userService.service.displayName}:`);
                    console.log(`        OAuth Token: ${userService.oauthToken ? '✅ Présent' : '❌ Manquant'}`);
                    console.log(`        Refresh Token: ${userService.refreshToken ? '✅ Présent' : '❌ Manquant'}`);
                    if (userService.refreshToken) {
                        console.log(`        Refresh Token (aperçu): ${userService.refreshToken.substring(0, 20)}...`);
                    }
                }
            }
            console.log('');
        }

        // Vérifier aussi tous les services Google
        const googleServices = await prisma.userService.findMany({
            where: {
                service: {
                    name: 'google'
                }
            },
            include: {
                user: true,
                service: true
            }
        });

        console.log(`🔑 Total des connexions Google: ${googleServices.length}`);
        if (googleServices.length > 0) {
            console.log('Détails:');
            for (const gs of googleServices) {
                console.log(`   - User ${gs.user.username} (${gs.user.email}): Refresh Token ${gs.refreshToken ? '✅' : '❌'}`);
            }
        }

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    checkGoogleTokens().catch(console.error);
}

module.exports = { checkGoogleTokens };