import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestNotificationRequestDto {
  @ApiProperty({ description: '친구 요청을 보낸 유저의 닉네임' })
  senderNickname: string;

  @ApiProperty({ description: '친구 요청을 받을 유저의 닉네임' })
  friendNickname: string;
}
