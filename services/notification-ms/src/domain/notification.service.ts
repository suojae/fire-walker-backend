import { Injectable, Logger } from '@nestjs/common';
import { FcmGateway } from '../infrastructure/fcm.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly fcmGateway: FcmGateway,
  ) {}

  /**
   * 친구 요청 알림 전송
   */
  async sendFriendRequestNotification(recipientUuid: string, senderNickname: string) {
    const notificationPayload = {
      title: '친구 요청',
      body: `${senderNickname} 님이 친구 요청을 보냈습니다.`,
      recipientUuid,
    };

    // FCM 전송
    await this.fcmGateway.sendNotification([recipientUuid], notificationPayload);
    this.logger.log(`Friend request notification sent to user ${recipientUuid}`);
  }

  /**
   * 친구 요청 수락 알림 전송
   */
  async sendFriendAcceptNotification(requesterUuid: string, recipientNickname: string) {
    const notificationPayload = {
      title: '친구 요청 수락',
      body: `${recipientNickname} 님이 친구 요청을 수락했습니다.`,
      requesterUuid,
    };

    await this.fcmGateway.sendNotification([requesterUuid], notificationPayload);
    this.logger.log(`Friend accept notification sent to user ${requesterUuid}`);
  }
}
