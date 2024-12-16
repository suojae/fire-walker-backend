import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisConfig {
  public readonly redisClient: Redis;

  constructor() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
    });
  }
}
