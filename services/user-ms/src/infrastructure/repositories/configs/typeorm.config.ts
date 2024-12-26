import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserOrmEntity } from '../dao/user.orm-entity';
import { FriendshipOrmEntity } from '../dao/friendship.orm-entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost', // 로컬 MySQL 컨테이너 호스트
  port: 3306,        // 로컬 MySQL 포트
  username: 'root',  // MySQL 유저네임
  password: 'password', // MySQL 비밀번호
  database: 'test_db',   // MySQL 데이터베이스 이름
  entities: [UserOrmEntity, FriendshipOrmEntity],
  synchronize: true,     // 개발 환경에서만 사용 (운영 환경에서는 false)
};
