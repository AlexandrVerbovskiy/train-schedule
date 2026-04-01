import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsUrls = process.env.CORS_URLS
    ? process.env.CORS_URLS.split(',')
    : [];

  app.enableCors({
    origin: process.env.NODE_ENV === 'dev' ? '*' : corsUrls,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
