// Test de l'authentification
console.log('=== Test Authentification ===');

// Simuler une connexion utilisateur
const testUser = {
  id: 'test-123',
  username: 'TestUser',
  email: 'test@example.com',
};

// Sauvegarder dans localStorage (comme le fait la vraie authentification)
localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('token', 'test-token-123');

console.log('Utilisateur test créé:', testUser);
console.log('Données localStorage:', {
  user: localStorage.getItem('user'),
  token: localStorage.getItem('token'),
});

// Recharger la page pour tester la persistence
setTimeout(() => {
  console.log(
    'Test terminé. Vous devriez maintenant pouvoir accéder au dashboard.'
  );
}, 1000);
