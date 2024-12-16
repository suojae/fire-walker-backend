import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  console.log('User service is running...');
  await app.listen(3000);
}
bootstrap();
