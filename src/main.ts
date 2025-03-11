import { json, urlencoded } from "express"
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("NestJS e-commerce API")
    .setDescription("API builded with NestJS to be used for online stores.")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("api", app, document)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
