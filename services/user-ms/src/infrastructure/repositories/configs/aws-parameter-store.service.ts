import { Injectable } from '@nestjs/common';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

@Injectable()
export class AwsParameterStoreService {
  private ssmClient: SSMClient;

  constructor() {
    this.ssmClient = new SSMClient({ region: 'ap-northeast-2' });
  }

  async getParameter(name: string): Promise<string> {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    });

    const response = await this.ssmClient.send(command);
    return response.Parameter?.Value || '';
  }
}

