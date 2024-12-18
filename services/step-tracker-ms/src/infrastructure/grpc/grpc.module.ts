import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STEP_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'step',
          protoPath: join(__dirname, 'step.proto'),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
