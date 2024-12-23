import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AwsParameterStoreService } from './aws-parameter-store.service';

@Injectable()
export class RedisConfig {
  public redisClient: Redis;

  constructor(private readonly awsService: AwsParameterStoreService) {
    this.initialize();
  }

  private async initialize() {
    const redisHost = await this.awsService.getParameter('/userms/redis/host');
    const redisPort = parseInt(await this.awsService.getParameter('/userms/redis/port'), 10);

    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
    });
  }
}
