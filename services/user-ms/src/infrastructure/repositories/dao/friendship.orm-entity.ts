import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('friendships')
export class FriendshipOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  userUuid: string;

  @Column({ type: 'varchar', length: 36 })
  friendUuid: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'],
    default: 'PENDING',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
