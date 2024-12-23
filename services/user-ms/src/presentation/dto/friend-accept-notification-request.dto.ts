import { ApiProperty } from '@nestjs/swagger';

export class FriendAcceptNotificationRequestDto {
  @ApiProperty({ description: '친구 요청을 수락한 유저의 닉네임' })
  recipientNickname: string;

  @ApiProperty({ description: '친구 요청을 한 유저의 닉네임(= 친구로 추가했던 유저)' })
  friendNickname: string;
}

export class FriendAcceptNotificationResponseDto {
  @ApiProperty({ description: '처리 결과 메시지' })
  message: string;
}
