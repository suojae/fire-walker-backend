import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './presentation/user.controller';
import { UserUsecase } from './domain/user.usecase';
import { NotificationGateway } from './infrastructure/gateways/notification.gateway';
import { TokenService } from './infrastructure/services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/repositories/dao/user.orm-entity';
import { RedisConfig } from './infrastructure/repositories/configs/redis.config';
import { UserDao } from './infrastructure/repositories/dao/user.dao';
import { RefreshTokenDao } from './infrastructure/repositories/dao/refresh-token.dao';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { typeOrmConfig } from './infrastructure/repositories/configs/typeorm.config';
import { FriendshipRepository } from './infrastructure/repositories/friendship.repository';
import { FriendshipDao } from './infrastructure/repositories/dao/friendship.dao';
import { HttpModule } from '@nestjs/axios';
import { FriendshipOrmEntity } from './infrastructure/repositories/dao/friendship.orm-entity';
import { AwsParameterStoreService } from './infrastructure/repositories/configs/aws-parameter-store.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM 비동기 설정
    TypeOrmModule.forRootAsync({
      inject: [AwsParameterStoreService],
      useFactory: async (awsService: AwsParameterStoreService) =>
        await typeOrmConfig(awsService),
    }),

    // TypeORM 엔티티 등록
    TypeOrmModule.forFeature([UserOrmEntity, FriendshipOrmEntity]),

    HttpModule,
  ],
  controllers: [UserController],
  providers: [
    AwsParameterStoreService,
    RedisConfig,
    UserDao,
    RefreshTokenDao,
    UserRepository,
    UserUsecase,
    TokenService,
    NotificationGateway,
    FriendshipDao,
    FriendshipRepository,
  ],
  exports: [
    UserUsecase,
    FriendshipDao,
    FriendshipRepository,
    AwsParameterStoreService,
  ],
})
export class UserModule {}
