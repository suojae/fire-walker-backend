import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendshipOrmEntity } from './friendship.orm-entity';

@Injectable()
export class FriendshipDao {
  constructor(
    @InjectRepository(FriendshipOrmEntity)
    private readonly friendshipRepository: Repository<FriendshipOrmEntity>,
  ) {}

  async createFriendship(friendship: FriendshipOrmEntity): Promise<FriendshipOrmEntity> {
    return this.friendshipRepository.save(friendship);
  }

  async findFriendship(userUuid: string, friendUuid: string): Promise<FriendshipOrmEntity | null> {
    return this.friendshipRepository.findOne({
      where: { userUuid, friendUuid },
    });
  }

  /**
   * userUuid가 들어간 친구 관계 모두 찾기 (양방향)
   * - userUuid가 요청자이든, friendUuid가 요청자이든 전부 조회
   */
  async findAllByUserUuid(userUuid: string): Promise<FriendshipOrmEntity[]> {
    return this.friendshipRepository.find({
      where: [
        { userUuid },
        { friendUuid: userUuid },
      ],
    });
  }

  async updateFriendshipStatus(id: number, status: string): Promise<FriendshipOrmEntity> {
    await this.friendshipRepository.update(id, { status });
    const updatedFriendship = await this.friendshipRepository.findOneBy({ id });

    if (!updatedFriendship) {
      throw new Error(`Friendship with id ${id} not found`);
    }

    return updatedFriendship;
  }
}
