#!/usr/bin/env node

/**
 * Script pour nettoyer les anciens tokens Google et forcer une reconnexion
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function cleanGoogleTokens() {
    console.log('🧹 Nettoyage des anciens tokens Google...\n');

    try {
        // Trouver le service Google
        const googleService = await prisma.service.findUnique({
            where: { name: 'google' }
        });

        if (!googleService) {
            console.log('❌ Service Google non trouvé dans la base de données');
            return;
        }

        console.log(`🔍 Service Google trouvé (ID: ${googleService.id})`);

        // Supprimer tous les UserServices pour Google
        const deletedUserServices = await prisma.userService.deleteMany({
            where: {
                serviceId: googleService.id
            }
        });

        console.log(`🗑️  Supprimé ${deletedUserServices.count} UserService(s) Google`);

        // Vérifier les utilisateurs
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true
            }
        });

        console.log('\n👥 Utilisateurs dans la base:');
        users.forEach(user => {
            console.log(`  - ID: ${user.id}, Email: ${user.email}, Username: ${user.username}`);
        });

        console.log('\n✅ Nettoyage terminé!');
        console.log('\n🔄 PROCHAINES ÉTAPES:');
        console.log('1. Redémarrez l\'application');
        console.log('2. Dans le frontend, déconnectez-vous et reconnectez-vous avec Google');
        console.log('3. Cette fois, approuvez TOUTES les permissions (Gmail, Calendar, Contacts)');
        console.log('4. Les tokens seront stockés avec tous les scopes nécessaires');

    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    cleanGoogleTokens();
}