// src/interfaces/notification.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { NotificationService } from '../domain/notification.service';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * 친구 요청 알림 전송
   */
  @Post('friend-request')
  async sendFriendRequestNotification(@Body() dto: { recipientUuid: string; senderNickname: string }) {
    // TODO: 로직 추후구현
    return { message: 'Friend request notification sent.' };
  }

  /**
   * 친구 요청 수락 알림 전송
   */
  @Post('friend-accept')
  async sendFriendAcceptNotification(@Body() dto: { requesterUuid: string; recipientNickname: string }) {
    // TODO: 로
    return { message: 'Friend accept notification sent.' };
  }

  /**
   * 실시간 랭킹 갱신 알림 전송 (선택적으로 구현)
   */
  @Post('ranking-update')
  async sendRankingUpdateNotification(@Body() dto: { userUuids: string[]; rankingData: any }) {
    // TODO:
    return { message: 'Ranking update notification sent.' };
  }
}
