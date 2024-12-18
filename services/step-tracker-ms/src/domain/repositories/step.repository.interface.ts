import { StepEntity } from '../entities/step';

export interface StepRepositoryInterface {
  saveSteps(userId: string, steps: number, date: string): Promise<void>;
  getStepsByUser(userId: string): Promise<StepEntity[]>;
}
