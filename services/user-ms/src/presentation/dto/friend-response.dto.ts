import { ApiProperty } from '@nestjs/swagger';

export class FriendResponseDto {
  @ApiProperty({ example: true, description: '친구 요청 성공 여부' })
  success: boolean;

  @ApiProperty({ example: 'Request Sent', description: '결과 메시지' })
  message: string;
}

export class FriendAcceptResponseDto {
  @ApiProperty({ example: true, description: '친구 요청 수락 성공 여부' })
  success: boolean;

  @ApiProperty({ example: 'Friend Accepted', description: '결과 메시지' })
  message: string;
}
