import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn({ length: 36 })
  uuid: string;

  @Column({ length: 100 })
  socialId: string;

  @Column({ length: 50 })
  nickName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fcmToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
