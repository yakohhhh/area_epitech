import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002', // Frontend React (port actuel)
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:5174', // Mobile Ionic (port actuel)
      'http://localhost:5175', // Mobile Ionic (port alternatif)
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'ionic://localhost',
      'capacitor://localhost',
      'https://area-delta.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  const port = process.env.PORT || 5001;
// Résumé : Point d'entrée de l'application NestJS, démarre le serveur HTTP sur le port 5001.
  await app.listen(port); 
  console.log(`🚀 AREA Backend server running on http://localhost:${port}`);
}
bootstrap();
