import { Injectable } from '@nestjs/common';
import { StepRepository } from '../../infrastructure/persistence/typeorm/repositories/step.repository';

@Injectable()
export class RecordStepsUseCase {
  constructor(private readonly stepRepository: StepRepository) {}

  async execute(userId: string, steps: number, date: string): Promise<void> {
    await this.stepRepository.saveSteps(userId, steps, date);
  }
}
