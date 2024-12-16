import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserOrmEntity } from '../dao/user.orm-entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'testdb',
  entities: [UserOrmEntity],
  synchronize: true, // 개발 환경에서만 true, 운영 환경에서는 false
};
