import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisConfig {
  public readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = +this.configService.get<number>('REDIS_PORT', 6379);

    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
    });
  }
}
