import { Injectable } from '@nestjs/common';
import { FriendshipDao } from './dao/friendship.dao';
import { FriendshipOrmEntity } from './dao/friendship.orm-entity';

@Injectable()
export class FriendshipRepository {
  constructor(private readonly friendshipDao: FriendshipDao) {}

  async createFriendship(userUuid: string, friendUuid: string): Promise<void> {
    const newEntity = new FriendshipOrmEntity();
    newEntity.userUuid = userUuid;
    newEntity.friendUuid = friendUuid;
    newEntity.status = 'PENDING';

    await this.friendshipDao.createFriendship(newEntity);
  }

  async findFriendship(userUuid: string, friendUuid: string): Promise<FriendshipOrmEntity | null> {
    return this.friendshipDao.findFriendship(userUuid, friendUuid);
  }

  async findAllFriendships(userUuid: string): Promise<FriendshipOrmEntity[]> {
    return this.friendshipDao.findAllByUserUuid(userUuid);
  }

  async updateStatus(id: number, status: string): Promise<FriendshipOrmEntity> {
    return this.friendshipDao.updateFriendshipStatus(id, status);
  }
}
