import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestDto {
  @ApiProperty({ example: 'nickname567', description: '친구 요청을 보낼 닉네임' })
  friendNickname: string;
}

export class FriendAcceptRequestDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174999',
    description: '수락할 친구 요청의 유저 UUID',
  })
  friendUserId: string;
}
