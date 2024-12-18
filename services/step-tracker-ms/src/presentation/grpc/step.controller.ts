import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RecordStepsUseCase } from '../../application/use-cases/record-steps.usecase';
import { GetStepsByUserUseCase } from '../../application/use-cases/get-steps-by-user.usecase';

@Controller()
export class StepController {
  constructor(
    private readonly recordStepsUseCase: RecordStepsUseCase,
    private readonly getStepsByUserUseCase: GetStepsByUserUseCase,
  ) {}

  @GrpcMethod('StepService', 'RecordSteps')
  async recordSteps(data: { userId: string; steps: number; date: string }): Promise<{ message: string }> {
    await this.recordStepsUseCase.execute(data.userId, data.steps, data.date);
    return { message: 'Steps recorded successfully' };
  }

  @GrpcMethod('StepService', 'GetStepsByUser')
  async getStepsByUser(data: { userId: string }): Promise<{ records: any[] }> {
    const steps = await this.getStepsByUserUseCase.execute(data.userId);
    return {
      records: steps.map((step) => ({
        date: step.date,
        steps: step.steps,
      })),
    };
  }
}
