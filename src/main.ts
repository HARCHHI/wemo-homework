import { writeFile } from 'fs/promises';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('WEMO Homework')
    .setDescription('A simple scooter rent service')
    .setVersion('1.0')
    .addTag('scooters')
    .addTag('users')
    .addTag('rents')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV === 'develop') {
    writeFile('./docs/swagger.json', JSON.stringify(document, null, 2));
  }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
