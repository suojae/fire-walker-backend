import { Module } from '@nestjs/common';
import { StepServiceController } from './step.controller';
import { StepService } from './step.service';

@Module({
  controllers: [StepServiceController],
  providers: [StepService],
})
export class AppModule {}
