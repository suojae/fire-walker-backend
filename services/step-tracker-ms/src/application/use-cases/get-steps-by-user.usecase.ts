import { Injectable } from '@nestjs/common';
import { StepRepository } from '../../infrastructure/persistence/typeorm/repositories/step.repository';
import { Step } from '../../infrastructure/persistence/typeorm/entities/step.entity';

@Injectable()
export class GetStepsByUserUseCase {
  constructor(private readonly stepRepository: StepRepository) {}

  async execute(userId: string): Promise<Step[]> {
    return this.stepRepository.getStepsByUser(userId);
  }
}
