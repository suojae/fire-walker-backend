import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './presentation/user.controller';
import { UserUsecase } from './domain/user.usecase';
import { AuthGateway } from './infrastructure/gateways/auth.gateway';
import { KakaoAuthService } from './infrastructure/gateways/kakao-auth.service';
import { KakaoAuthConfig } from './infrastructure/gateways/kakao-auth.config';
import { NotificationGateway } from './infrastructure/gateways/notification.gateway';
import { TokenService } from './infrastructure/services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UserController],
  providers: [
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
