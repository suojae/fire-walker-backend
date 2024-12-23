import { ApiProperty } from '@nestjs/swagger';

/**
 * Notification-MS로 친구 요청 수락 알림을 보낼 때 사용하는 DTO
 */
export class FriendAcceptNotificationDto {
  @ApiProperty({ description: '알림을 받을 유저들의 FCM 토큰 배열' })
  tokens: string[];

  @ApiProperty({ description: '친구 요청을 수락한 유저의 닉네임' })
  recipientNickname: string;
}

/**
 * Notification-MS로부터 수신할 응답 DTO
 */
export class FriendAcceptNotificationResponseDto {
  @ApiProperty({ description: '처리 결과 메시지' })
  message: string;
}
