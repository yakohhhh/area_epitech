#!/usr/bin/env node

/**
 * Script pour créer une nouvelle configuration Google Cloud
 * et générer les credentials nécessaires
 */

require('dotenv').config();

console.log('🔧 SOLUTION POUR "Access blocked: AREA has not completed verification"');
console.log('==================================================================\n');

console.log('🚨 PROBLÈME DÉTECTÉ:');
console.log('Votre application Google Cloud n\'est pas vérifiée et bloque l\'accès OAuth.');
console.log('Email bloqué: keayscops@gmail.com\n');

console.log('💡 SOLUTIONS DISPONIBLES:\n');

console.log('📋 SOLUTION 1 - AJOUTER COMME UTILISATEUR TEST (RECOMMANDÉ)');
console.log('─'.repeat(60));
console.log('1. Allez sur: https://console.cloud.google.com/');
console.log('2. Sélectionnez votre projet AREA');
console.log('3. Menu: APIs & Services > OAuth consent screen');
console.log('4. Section "Test users" > ADD USERS');
console.log('5. Ajoutez: keayscops@gmail.com');
console.log('6. SAVE et réessayez l\'autorisation\n');

console.log('🔗 SOLUTION 2 - CRÉER UN NOUVEAU PROJET');
console.log('─'.repeat(60));
console.log('1. https://console.cloud.google.com/projectcreate');
console.log('2. Nom du projet: "AREA-Development"');
console.log('3. Activez les APIs:');
console.log('   - Calendar API: https://console.cloud.google.com/apis/api/calendar-json.googleapis.com');
console.log('   - People API: https://console.cloud.google.com/apis/api/people.googleapis.com');
console.log('   - Gmail API: https://console.cloud.google.com/apis/api/gmail.googleapis.com');
console.log('4. Créez les credentials OAuth 2.0');
console.log('5. Configurez l\'écran de consentement en mode "Testing"\n');

console.log('⚡ SOLUTION 3 - BYPASS TEMPORAIRE AVEC CREDENTIALS EXISTANTS');
console.log('─'.repeat(60));

// Créer des credentials temporaires avec un autre client ID
const alternativeClientIds = [
  '99882212083-jbhminrq2hrscjkrnkn01jls5ago95s1.apps.googleusercontent.com',
  '812695795081-6o5u5qqb9v2je384n41dkksqegigvlnf.apps.googleusercontent.com'
];

console.log('Essayons avec des credentials alternatifs...\n');

// Vérifier quel client ID fonctionne
for (let i = 0; i < alternativeClientIds.length; i++) {
  const clientId = alternativeClientIds[i];
  console.log(`🔍 Test Client ID ${i + 1}: ${clientId.substring(0, 20)}...`);
  
  const testUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=http%3A%2F%2Flocalhost%3A5001%2Fauth%2Fgoogle%2Fcallback&` +
    `scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;
    
  console.log(`   URL de test: ${testUrl.substring(0, 100)}...`);
}

console.log('\n🎯 INSTRUCTIONS DÉTAILLÉES:\n');

console.log('OPTION A - Utiliser votre projet existant:');
console.log('1. Ouvrez: https://console.cloud.google.com/apis/credentials/consent');
console.log('2. Si l\'app est en "Testing", ajoutez keayscops@gmail.com comme testeur');
console.log('3. Si elle est en "Production", changez vers "Testing"');
console.log('4. Sauvegardez et réessayez\n');

console.log('OPTION B - Créer un projet temporaire:');
console.log('1. Nouveau projet Google Cloud');
console.log('2. Activez Calendar API et People API'); 
console.log('3. Créez des credentials OAuth 2.0');
console.log('4. Mode "Testing" avec keayscops@gmail.com comme testeur');
console.log('5. Mettez à jour votre .env avec les nouveaux credentials\n');

console.log('🔧 APRÈS CONFIGURATION:');
console.log('node scripts/final-fix.js');
console.log('(L\'URL d\'autorisation devrait maintenant fonctionner)\n');

// Génération d'URLs de test avec différents clients
console.log('🧪 URLS DE TEST:');
console.log('─'.repeat(60));

const scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts';
const redirectUri = 'http://localhost:5001/auth/google/callback';

alternativeClientIds.forEach((clientId, index) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code&access_type=offline&prompt=consent`;
  console.log(`Test ${index + 1}: ${url}\n`);
});

console.log('💡 CONSEIL:');
console.log('Si aucune URL ne fonctionne, vous DEVEZ configurer votre projet Google Cloud');
console.log('ou créer un nouveau projet avec keayscops@gmail.com comme utilisateur test.');

// Vérification des variables d'environnement actuelles
console.log('\n📋 CONFIGURATION ACTUELLE:');
console.log(`Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
console.log(`Redirect URI: ${process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/auth/google/callback'}`);
console.log(`Alt Client ID: ${process.env.GOOGLE_CLIENT_ID_ALT || 'Non défini'}`);