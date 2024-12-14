import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Notification Microservice')
    .setDescription('Notification MS API 문서')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.NOTIFICATION_MS_PORT || 3000;
  await app.listen(port);
  Logger.log(`Notification-MS is running on port ${port}`);
}
bootstrap();
