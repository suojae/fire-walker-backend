import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StepService } from './step.service';

@Controller()
export class StepServiceController {
  constructor(private readonly stepService: StepService) {}

  @GrpcMethod('StepService', 'UpdateSteps')
  updateSteps(data: { user_id: string; steps: number }) {
    console.log(`Update steps for user ${data.user_id}: ${data.steps}`);
    return { success: true };
  }

  @GrpcMethod('StepService', 'GetRanking')
  getRanking(data: { user_id: string }) {
    console.log(`Get ranking for user ${data.user_id}`);
    return {
      rankings: [
        { user_id: 'user1', steps: 5000 },
        { user_id: 'user2', steps: 4500 },
      ],
    };
  }
}
