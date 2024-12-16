import { Injectable } from '@nestjs/common';
import { RedisConfig } from '../configs/redis.config';

@Injectable()
export class RefreshTokenDao {
  private readonly REDIS_PREFIX = 'refreshToken:';

  constructor(private readonly redisConfig: RedisConfig) {}

  async saveRefreshToken(userUuid: string, refreshToken: string): Promise<void> {
    const key = `${this.REDIS_PREFIX}${userUuid}`;
    // 만료기간(14일) 설정
    await this.redisConfig.redisClient.set(key, refreshToken, 'EX', 14 * 24 * 60 * 60);
  }

  async getRefreshToken(userUuid: string): Promise<string | null> {
    const key = `${this.REDIS_PREFIX}${userUuid}`;
    const token = await this.redisConfig.redisClient.get(key);
    return token;
  }

  async deleteRefreshToken(userUuid: string): Promise<void> {
    const key = `${this.REDIS_PREFIX}${userUuid}`;
    await this.redisConfig.redisClient.del(key);
  }
}
