import { Injectable } from '@nestjs/common';
import { Provider, UserEntity } from '../../domain/user.entity';
import { UserDao } from './dao/user.dao';
import { RefreshTokenDao } from './dao/refresh-token.dao';
import { UserOrmEntity } from './dao/user.orm-entity';

@Injectable()
export class UserRepository {
  constructor(
    private readonly userDao: UserDao,
    private readonly refreshTokenDao: RefreshTokenDao,
  ) {}

  /**
   * 유저 정보를 MySQL에 저장
   */
  async saveUser(userEntity: UserEntity): Promise<void> {
    const userOrm = new UserOrmEntity();
    userOrm.uuid = userEntity.getUuid();
    userOrm.socialId = userEntity.getSocialId();
    userOrm.provider = userEntity.getProvider();
    userOrm.nickName = userEntity.getNickName();
    // createdAt, updatedAt은 TypeORM @CreateDateColumn / @UpdateDateColumn이 자동 처리

    await this.userDao.createOrUpdateUser(userOrm);
  }

  /**
   * 유저 정보 로드
   */
  async findUserByUuid(uuid: string): Promise<UserEntity | null> {
    const userOrm = await this.userDao.findUserByUuid(uuid);
    if (!userOrm) return null;

    // MySQL -> Domain Entity 변환
    return new UserEntity({
      uuid: userOrm.uuid,
      socialId: userOrm.socialId,
      provider: userOrm.provider as Provider,
      nickName: userOrm.nickName,
      createdAt: userOrm.createdAt,
      updatedAt: userOrm.updatedAt,
    });
  }

  /**
   * Redis에 Refresh Token 저장 (RTR 시)
   */
  async saveRefreshToken(
    userUuid: string,
    refreshToken: string,
  ): Promise<void> {
    await this.refreshTokenDao.saveRefreshToken(userUuid, refreshToken);
  }

  async getRefreshToken(userUuid: string): Promise<string | null> {
    return this.refreshTokenDao.getRefreshToken(userUuid);
  }

  async deleteRefreshToken(userUuid: string): Promise<void> {
    return this.refreshTokenDao.deleteRefreshToken(userUuid);
  }
}
