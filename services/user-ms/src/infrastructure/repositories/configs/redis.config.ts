import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisConfig {
  public redisClient: Redis;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }
}
