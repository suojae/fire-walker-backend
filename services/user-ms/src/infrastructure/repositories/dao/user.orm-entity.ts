import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn({ length: 36 })
  uuid: string;

  @Column({ length: 100 })
  socialId: string;

  @Column({ length: 50 })
  provider: string;

  @Column({ length: 50 })
  nickName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
