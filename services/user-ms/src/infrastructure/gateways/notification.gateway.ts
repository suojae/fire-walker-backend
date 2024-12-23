import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import {
  FriendRequestNotificationDto,
  FriendRequestNotificationResponseDto,
} from './dto/friend-request-notification.dto';
import { FriendAcceptNotificationDto, FriendAcceptNotificationResponseDto } from './dto/friend-accept-notification.dto';

@Injectable()
export class NotificationGateway {
  private readonly logger = new Logger(NotificationGateway.name);
  private readonly NOTIFICATION_MS_BASE_URL = process.env.NOTIFICATION_MS_BASE_URL || 'http://notification-ms:3000';

  constructor(private readonly httpService: HttpService) {}

  /**
   * 친구 요청 알림을 Notification-MS에 전송
   * @param dto FriendRequestNotificationDto
   * @returns FriendRequestNotificationResponseDto
   */
  async sendFriendRequestNotification(dto: FriendRequestNotificationDto): Promise<FriendRequestNotificationResponseDto> {
    try {
      const url = `${this.NOTIFICATION_MS_BASE_URL}/notifications/friend-request`;
      const response: AxiosResponse<FriendRequestNotificationResponseDto> = await lastValueFrom(
        this.httpService.post(url, dto),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`AxiosError while sending friend request notification: ${error.message}`);
      } else {
        this.logger.error(`Error while sending friend request notification: ${error}`);
      }
      throw new Error('Failed to send friend request notification');
    }
  }

  /**
   * 친구 요청 수락 알림을 Notification-MS에 전송
   * @param dto FriendAcceptNotificationDto
   * @returns FriendAcceptNotificationResponseDto
   */
  async sendFriendAcceptNotification(dto: FriendAcceptNotificationDto): Promise<FriendAcceptNotificationResponseDto> {
    try {
      const url = `${this.NOTIFICATION_MS_BASE_URL}/notifications/friend-accept`;
      const response: AxiosResponse<FriendAcceptNotificationResponseDto> = await lastValueFrom(
        this.httpService.post(url, dto),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`AxiosError while sending friend accept notification: ${error.message}`);
      } else {
        this.logger.error(`Error while sending friend accept notification: ${error}`);
      }
      throw new Error('Failed to send friend accept notification');
    }
  }
}
