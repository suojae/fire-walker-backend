import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestDto {
  @ApiProperty({ description: '친구 요청을 받을 유저들의 FCM 토큰 배열' })
  tokens: string[];

  @ApiProperty({ description: '친구 요청을 보낸 유저의 닉네임' })
  senderNickname: string;
}
