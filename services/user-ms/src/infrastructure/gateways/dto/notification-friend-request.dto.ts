import { ApiProperty } from '@nestjs/swagger';

// User-MS -> Notification-MS 로 전달할 Request DTO
export class NotificationFriendRequestDto {
  @ApiProperty({ description: '친구 요청 받는 유저의 UUID' })
  recipientUuid: string;

  @ApiProperty({ description: '요청을 보낸 유저의 닉네임' })
  senderNickname: string;
}
