import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './presentation/user.controller';
import { UserUsecase } from './domain/user.usecase';
import { AuthGateway } from './infrastructure/gateways/auth.gateway';
import { KakaoAuthService } from './infrastructure/gateways/kakao-auth.service';
import { KakaoAuthConfig } from './infrastructure/gateways/kakao-auth.config';
import { NotificationGateway } from './infrastructure/gateways/notification.gateway';
import { TokenService } from './infrastructure/services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/repositories/configs/typeorm.config';
import { UserOrmEntity } from './infrastructure/repositories/dao/user.orm-entity';
import { RedisConfig } from './infrastructure/repositories/configs/redis.config';
import { UserDao } from './infrastructure/repositories/dao/user.dao';
import { RefreshTokenDao } from './infrastructure/repositories/dao/refresh-token.dao';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [UserController],
  providers: [
    RedisConfig,
    UserDao,
    RefreshTokenDao,
    UserRepository,
    UserUsecase,
    AuthGateway,
    KakaoAuthService,
    TokenService,
    KakaoAuthConfig,
    NotificationGateway,
  ],
  exports: [
    UserUsecase,
  ],
})
export class UserModule {}
