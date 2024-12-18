import { Repository } from 'typeorm';
import { Step } from '../entities/step.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StepRepository {
  constructor(
    @InjectRepository(Step)
    private readonly repository: Repository<Step>,
  ) {}

  async saveSteps(userId: string, steps: number, date: string): Promise<void> {
    const step = this.repository.create({ userId, steps, date });
    await this.repository.save(step);
  }

  async getStepsByUser(userId: string): Promise<Step[]> {
    return this.repository.find({ where: { userId } });
  }
}
