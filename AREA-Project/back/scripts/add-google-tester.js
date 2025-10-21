#!/usr/bin/env node

/**
 * Guide pour résoudre l'erreur "Access blocked: App not verified"
 * Email concerné: kjuuuniedraaa@gmail.com
 */

console.log('🚨 PROBLÈME: "Access blocked: AREA has not completed verification"');
console.log('📧 Email affecté: kjuuuniedraaa@gmail.com');
console.log('='.repeat(80));

console.log('\n🔍 CAUSE:');
console.log('Votre application Google Cloud est en mode "Testing" et seuls les testeurs approuvés peuvent y accéder.');

console.log('\n✅ SOLUTION: Ajouter kjuuuniedraaa@gmail.com comme testeur');

console.log('\n📋 ÉTAPES À SUIVRE:');
console.log('1. Ouvrez votre navigateur web');
console.log('2. Allez sur: https://console.cloud.google.com/');
console.log('3. Connectez-vous avec keayscops@gmail.com (le propriétaire du projet)');

console.log('\n4. Dans le menu de gauche: "APIs & Services" > "OAuth consent screen"');

console.log('\n5. Dans la section "Test users":');
console.log('   - Cliquez sur "ADD USERS"');
console.log('   - Ajoutez: kjuuuniedraaa@gmail.com');
console.log('   - Cliquez sur "SAVE"');

console.log('\n6. Réessayez la connexion Google dans votre application');

console.log('\n' + '='.repeat(80));
console.log('🔗 LIEN DIRECT:');
console.log('https://console.cloud.google.com/apis/credentials/consent');
console.log('='.repeat(80));

console.log('\n⚠️  IMPORTANT:');
console.log('- Vous devez être connecté avec keayscops@gmail.com pour modifier les testeurs');
console.log('- L\'ajout peut prendre quelques minutes pour prendre effet');
console.log('- Si ça ne marche pas, essayez de rafraîchir la page de consentement OAuth');

console.log('\n🎯 APRÈS AVOIR AJOUTÉ LE TESTEUR:');
console.log('Retournez dans votre application et cliquez à nouveau sur "Se connecter avec Google"');
console.log('L\'autorisation devrait maintenant fonctionner.');

console.log('\n💡 CONSEIL:');
console.log('Pour éviter ce problème à l\'avenir, vous pouvez:');
console.log('1. Publier l\'application (processus long avec Google)');
console.log('2. Ou garder le mode "Testing" et ajouter tous les utilisateurs nécessaires');

process.exit(0);