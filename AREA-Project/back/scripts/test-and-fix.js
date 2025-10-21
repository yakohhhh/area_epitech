#!/usr/bin/env node

/**
 * Script de test pour vérifier si nous pouvons contourner le problème
 * en utilisant directement l'API Google sans re-authentification
 */

require('dotenv').config();

const { google } = require('googleapis');

async function testAndFixScopes() {
  console.log('🔍 Analyse du problème OAuth et tentative de résolution...\n');

  // Créer un client OAuth2 avec les scopes corrects
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5001/auth/google/callback'
  );

  // Définir le refresh token actuel
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  console.log('1️⃣  Test du refresh token actuel...');

  try {
    // Essayer de rafraîchir le token
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log('✅ Refresh token valide - Access token obtenu');
    
    // Tester l'accès à Google Calendar
    console.log('\n2️⃣  Test d\'accès Google Calendar...');
    
    oauth2Client.setCredentials(credentials);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    try {
      const response = await calendar.calendars.get({ calendarId: 'primary' });
      console.log('✅ Google Calendar accessible!');
      console.log(`📅 Calendrier principal: ${response.data.summary}`);
      
      // Test création d'événement
      console.log('\n3️⃣  Test création d\'événement...');
      const event = {
        summary: 'Test AREA App',
        description: 'Test automatique de l\'intégration',
        start: {
          dateTime: new Date(Date.now() + 60000).toISOString(),
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: new Date(Date.now() + 120000).toISOString(),
          timeZone: 'Europe/Paris',
        },
      };
      
      const eventResponse = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      
      console.log('✅ Événement créé avec succès!');
      console.log(`🎉 ID: ${eventResponse.data.id}`);
      
      // Supprimer l'événement test
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventResponse.data.id,
      });
      console.log('🗑️  Événement test supprimé');
      
    } catch (calError) {
      console.log('❌ Erreur Google Calendar:', calError.message);
      
      if (calError.message.includes('insufficient authentication scopes')) {
        console.log('\n🚨 PROBLÈME CONFIRMÉ: Scopes insuffisants');
        console.log('🔧 Le refresh token n\'a pas les bonnes permissions');
        return false;
      }
    }

    // Tester l'accès à Google Contacts
    console.log('\n4️⃣  Test d\'accès Google Contacts...');
    
    try {
      const people = google.people({ version: 'v1', auth: oauth2Client });
      const contacts = await people.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses',
        pageSize: 1,
      });
      
      console.log('✅ Google Contacts accessible!');
      console.log(`👥 Contacts trouvés: ${contacts.data.totalItems || 0}`);
      
    } catch (contactError) {
      console.log('❌ Erreur Google Contacts:', contactError.message);
      
      if (contactError.message.includes('insufficient authentication scopes')) {
        console.log('\n🚨 PROBLÈME CONFIRMÉ: Scopes insuffisants pour Contacts');
        return false;
      }
    }

    console.log('\n🎉 TOUS LES TESTS RÉUSSIS!');
    console.log('✅ Le token fonctionne parfaitement avec tous les services');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur lors du refresh:', error.message);
    return false;
  }
}

async function generateWorkingToken() {
  console.log('\n🔧 GÉNÉRATION D\'UN NOUVEAU TOKEN AVEC LES BONS SCOPES...\n');
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5001/auth/google/callback'
  );

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/contacts.readonly'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  console.log('🔗 OUVREZ CETTE URL DANS VOTRE NAVIGATEUR:');
  console.log('─'.repeat(80));
  console.log(authUrl);
  console.log('─'.repeat(80));
  
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Cliquez sur le lien ci-dessus');
  console.log('2. Autorisez TOUTES les permissions (Calendar + Contacts)');
  console.log('3. Copiez le code de l\'URL de redirection');
  console.log('4. Exécutez: node scripts/final-fix.js VOTRE_CODE');
}

// Exécution principale
testAndFixScopes()
  .then((success) => {
    if (!success) {
      return generateWorkingToken();
    }
  })
  .catch((error) => {
    console.error('💥 Erreur inattendue:', error);
    generateWorkingToken();
  });