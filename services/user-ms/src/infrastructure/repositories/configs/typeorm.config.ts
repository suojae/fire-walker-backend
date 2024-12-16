import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserOrmEntity } from '../dao/user.orm-entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  username: process.env.MYSQL_USER || 'MYSQL_USER',
  password: process.env.MYSQL_PASSWORD || '12345',
  database: process.env.MYSQL_DATABASE || 'testdb',
  entities: [UserOrmEntity],
  synchronize: true,
};
