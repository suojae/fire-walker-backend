import { Module } from '@nestjs/common';
import { NotificationModule } from './presentation/notification.module';

@Module({
  imports: [NotificationModule],
})
export class AppModule {}
