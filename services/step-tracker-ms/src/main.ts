import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'step',
      protoPath: join(__dirname, './infrastructure/grpc/step.proto'),
      url: `0.0.0.0:${configService.get<number>('GRPC_PORT')}`,
    },
  });

  await app.listen();
  console.log(`🚀 gRPC server is running on port ${configService.get<number>('GRPC_PORT')}`);
}
bootstrap();
