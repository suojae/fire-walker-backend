import { Injectable } from '@nestjs/common';
import { FcmGateway } from '../infrastructure/fcm.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly fcmGateway: FcmGateway) {}

  /**
   * 친구 요청 알림 전송
   * @param tokens 수신할 유저들의 FCM 토큰 배열
   * @param senderNickname 친구 요청을 보낸 유저의 닉네임
   */
  async sendFriendRequestNotification(tokens: string[], senderNickname: string): Promise<void> {
    const payload = {
      title: '친구 요청',
      body: `${senderNickname}님이 친구 요청을 보냈습니다.`,
      data: { senderNickname }
    };
    await this.fcmGateway.sendNotification(tokens, payload);
  }

  /**
   * 친구 요청 수락 알림 전송
   * @param tokens 수락된 친구 요청을 보낸 유저들의 FCM 토큰 배열
   * @param recipientNickname 친구 요청을 수락한 유저의 닉네임
   */
  async sendFriendAcceptNotification(tokens: string[], recipientNickname: string): Promise<void> {
    const payload = {
      title: '친구 요청 수락',
      body: `${recipientNickname}님이 친구 요청을 수락했습니다.`,
      data: { recipientNickname }
    };
    await this.fcmGateway.sendNotification(tokens, payload);
  }
}
