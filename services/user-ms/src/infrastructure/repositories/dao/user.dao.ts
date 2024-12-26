import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserDao {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async updateUserByUuid(uuid: string, updateData: Partial<UserOrmEntity>): Promise<void> {
    if (!uuid) {
      throw new Error('UUID is required to update user information.');
    }
    await this.userRepository.update({ uuid }, updateData);
  }

  async createOrUpdateUser(user: UserOrmEntity): Promise<UserOrmEntity> {
    return this.userRepository.save(user);
  }

  async findUserByUuid(uuid: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOneBy({ uuid });
  }

  async findUserByNickname(nickname: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { nickName: nickname },
    });
  }

  async deleteUserByUuid(uuid: string): Promise<void> {
    await this.userRepository.delete({ uuid });
  }
}
