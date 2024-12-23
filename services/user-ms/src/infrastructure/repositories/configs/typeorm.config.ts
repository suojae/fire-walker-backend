import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AwsParameterStoreService } from './aws-parameter-store.service';
import { UserOrmEntity } from '../dao/user.orm-entity';
import { FriendshipOrmEntity } from '../dao/friendship.orm-entity';

export const typeOrmConfig = async (
  awsService: AwsParameterStoreService,
): Promise<TypeOrmModuleOptions> => {
  const host = await awsService.getParameter('/userms/mysql/host');
  const port = parseInt(await awsService.getParameter('/userms/mysql/port'), 10);
  const username = await awsService.getParameter('/userms/mysql/username');
  const password = await awsService.getParameter('/userms/mysql/password');
  const database = await awsService.getParameter('/userms/mysql/database');

  return {
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [UserOrmEntity, FriendshipOrmEntity],
    synchronize: true,
  };
};
