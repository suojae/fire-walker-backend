import { NestFactory } from '@nestjs/core';
import { NotificationMsModule } from './notification-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationMsModule);
  console.log('Notification service is running...');
  await app.listen(3000);
}
bootstrap();
