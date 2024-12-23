import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
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
    userOrm.nickName = userEntity.getNickName();

    // 추가
    userOrm.fcmToken = userEntity.getFcmToken() || null;

    await this.userDao.createOrUpdateUser(userOrm);
  }

  async findUserByUuid(uuid: string): Promise<UserEntity | null> {
    const userOrm = await this.userDao.findUserByUuid(uuid);
    if (!userOrm) return null;
    return this.ormEntityToDomain(userOrm);
  }

  async findUserByNickname(nickname: string): Promise<UserEntity | null> {
    const userOrm = await this.userDao.findUserByNickname(nickname);
    if (!userOrm) return null;
    return this.ormEntityToDomain(userOrm);
  }

  private ormEntityToDomain(userOrm: UserOrmEntity): UserEntity {
    return new UserEntity({
      uuid: userOrm.uuid,
      socialId: userOrm.socialId,
      nickName: userOrm.nickName,
      fcmToken: userOrm.fcmToken || undefined,
      createdAt: userOrm.createdAt,
      updatedAt: userOrm.updatedAt,
    });
  }

  async updateNickname(userUuid: string, newNickname: string): Promise<void> {
    await this.userDao.updateNicknameByUuid(userUuid, newNickname);
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

  async deleteUser(userUuid: string): Promise<void> {
    await this.userDao.deleteUserByUuid(userUuid);
  }
}
