import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequestResponseDto } from './dto/friend-request-response.dto';
import { FriendAcceptResponseDto } from './dto/friend-accept-response.dto';
import { FriendAcceptDto } from './dto/friend-accept.dto';
import { NotificationService } from '../domain/notification.service';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * 친구 요청 알림 전송
   */
  @ApiOperation({ summary: '친구 요청 알림 전송 API' })
  @ApiResponse({ status: 201, description: '성공', type: FriendRequestResponseDto })
  @Post('friend-request')
  async sendFriendRequestNotification(
    @Body() dto: FriendRequestDto,
  ): Promise<FriendRequestResponseDto> {
    this.logger.log(`Received friend request notification. Tokens: ${JSON.stringify(dto.tokens)}`);
    await this.notificationService.sendFriendRequestNotification(dto.tokens, dto.senderNickname);
    return { message: 'Friend request notification sent.' };
  }

  /**
   * 친구 요청 수락 알림 전송
   */
  @ApiOperation({ summary: '친구 요청 수락 알림 전송 API' })
  @ApiResponse({ status: 201, description: '성공', type: FriendAcceptResponseDto })
  @Post('friend-accept')
  async sendFriendAcceptNotification(
    @Body() dto: FriendAcceptDto,
  ): Promise<FriendAcceptResponseDto> {
    this.logger.log(`Received friend accept notification. Tokens: ${JSON.stringify(dto.tokens)}`);
    await this.notificationService.sendFriendAcceptNotification(dto.tokens, dto.recipientNickname);
    return { message: 'Friend accept notification sent.' };
  }
}
