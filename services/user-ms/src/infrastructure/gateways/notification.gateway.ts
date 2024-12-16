import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { NotificationFriendRequestDto } from './dto/notification-friend-request.dto';
import { NotificationFriendAcceptDto } from './dto/notification-friend-accept.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Injectable()
export class NotificationGateway {
  private readonly logger = new Logger(NotificationGateway.name);

  // 실제 환경에선 .env나 ConfigModule에서 Notification-MS의 baseUrl을 불러오기
  private readonly NOTIFICATION_MS_BASE_URL =
    'http://notification-ms:3000/notifications';

  /**
   * 친구 요청 알림 전송
   * - Notification-MS 의 POST /notifications/friend-request 호출
   * @param recipientUuid 친구 요청 받는 유저의 UUID
   * @param senderNickname 요청을 보낸 유저의 닉네임
   */
  async sendFriendRequestNotification(
    recipientUuid: string,
    senderNickname: string,
  ): Promise<NotificationResponseDto> {
    this.logger.log(
      `Calling Notification-MS(friend-request) for recipientUuid=${recipientUuid}, senderNickname=${senderNickname}`,
    );

    const requestBody: NotificationFriendRequestDto = {
      recipientUuid,
      senderNickname,
    };

    try {
      const response = await axios.post<NotificationResponseDto>(
        `${this.NOTIFICATION_MS_BASE_URL}/friend-request`,
        requestBody,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to send friend request notification: ${error}`,
      );
      throw error;
    }
  }

  /**
   * 친구 요청 수락 알림 전송
   * - Notification-MS 의 POST /notifications/friend-accept 호출
   * @param requesterUuid 친구 요청을 보낸 유저의 UUID
   * @param recipientNickname 친구 요청을 수락한 유저의 닉네임
   */
  async sendFriendAcceptNotification(
    requesterUuid: string,
    recipientNickname: string,
  ): Promise<NotificationResponseDto> {
    this.logger.log(
      `Calling Notification-MS(friend-accept) for requesterUuid=${requesterUuid}, recipientNickname=${recipientNickname}`,
    );

    const requestBody: NotificationFriendAcceptDto = {
      requesterUuid,
      recipientNickname,
    };

    try {
      const response = await axios.post<NotificationResponseDto>(
        `${this.NOTIFICATION_MS_BASE_URL}/friend-accept`,
        requestBody,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to send friend accept notification: ${error}`,
      );
      throw error;
    }
  }
}
