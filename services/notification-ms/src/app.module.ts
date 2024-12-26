import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FcmGateway } from './infrastructure/fcm.gateway';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './domain/notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [NotificationController],
  providers: [FcmGateway, NotificationService],
})
export class AppModule {}
