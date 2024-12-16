import { ApiProperty } from '@nestjs/swagger';

// User-MS -> Notification-MS 로 전달할 Request DTO
export class NotificationFriendAcceptDto {
  @ApiProperty({ description: '친구 요청을 보낸 유저의 UUID' })
  requesterUuid: string;

  @ApiProperty({ description: '친구 요청을 수락한 유저(현재 유저)의 닉네임' })
  recipientNickname: string;
}
