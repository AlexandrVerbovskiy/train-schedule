import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function validateEnv() {
  const requiredEnv = [
    'PORT',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'DEFAULT_USER_EMAIL',
    'DEFAULT_USER_PASSWORD',
    'JWT_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'REDIS_HOST',
    'REDIS_PORT',
  ];

  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      console.error(`🔴 FATAL ERROR: MISSING CRITICAL ENV VARIABLE: ${key}`);
      process.exit(1);
    }
  });
}

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);
  const corsUrls = process.env.CORS_URLS
    ? process.env.CORS_URLS.split(',')
    : [];

  app.enableCors({
    origin: process.env.NODE_ENV === 'dev' ? '*' : corsUrls,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Realway Network API')
    .setDescription('The train schedule management system API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT!;
  await app.listen(port);
  console.log(`✅ Server running on port ${port}`);
}
bootstrap().catch((e) => {
  console.error('❌ Failed to start server:', e);
  process.exit(1);
});
