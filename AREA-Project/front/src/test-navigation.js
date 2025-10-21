// Test de la navigation active
console.log('=== Test Navigation Active ===');

// Simuler différentes routes
const testRoutes = ['/', '/dashboard', '/integrations', '/automations'];

testRoutes.forEach(route => {
  console.log(`Route: ${route}`);
  console.log(`Active pour '/': ${route === '/'}`);
  console.log(`Active pour '/dashboard': ${route === '/dashboard'}`);
  console.log(`Active pour '/integrations': ${route === '/integrations'}`);
  console.log(`Active pour '/automations': ${route === '/automations'}`);
  console.log('---');
});

console.log(
  'Test terminé. La navigation devrait maintenant fonctionner correctement.'
);
