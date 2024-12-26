import { ApiProperty } from '@nestjs/swagger';

export class FriendAcceptDto {
  @ApiProperty({ description: '수락 알림을 받을 유저들의 FCM 토큰 배열' })
  tokens: string[];

  @ApiProperty({ description: '친구 요청을 수락한 유저의 닉네임' })
  recipientNickname: string;
}
