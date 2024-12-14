import { NestFactory } from '@nestjs/core';
import { StepModule } from './step.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StepModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'steptracker',
        protoPath: join(__dirname, 'proto/step.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  console.log('Step Tracker gRPC service is running on port 50051');
  await app.listen();
}

bootstrap();
