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

  async updateNicknameByUuid(uuid: string, newNickname: string): Promise<void> {
    await this.userRepository.update({ uuid }, { nickName: newNickname });
  }

  async createOrUpdateUser(user: UserOrmEntity): Promise<UserOrmEntity> {
    return this.userRepository.save(user);
  }

  async findUserByUuid(uuid: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOneBy({ uuid });
  }

  async findUserByNickname(nickName: string): Promise<UserOrmEntity | null> {
    return this.userRepository.findOne({
      where: { nickName },
    });
  }

  async deleteUserByUuid(uuid: string): Promise<void> {
    await this.userRepository.delete({ uuid });
  }
}
