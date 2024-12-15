import { ApiProperty } from '@nestjs/swagger';

export class FriendAcceptDto {
  @ApiProperty({ description: '친구 요청을 보낸 유저의 UUID' })
  requesterUuid: string;

  @ApiProperty({ description: '친구 요청을 수락한 유저의 닉네임' })
  recipientNickname: string;
}
