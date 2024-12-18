import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepController } from './presentation/grpc/step.controller';
import { Step } from './infrastructure/persistence/typeorm/entities/step.entity';
import { StepRepository } from './infrastructure';
import { RecordStepsUseCase } from './application/use-cases/record-steps.usecase';
import { GetStepsByUserUseCase } from './application/use-cases/get-steps-by-user.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Step],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Step]),
  ],
  controllers: [StepController],
  providers: [StepRepository, RecordStepsUseCase, GetStepsByUserUseCase],
})
export class AppModule {}
