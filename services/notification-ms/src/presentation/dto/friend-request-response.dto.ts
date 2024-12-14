import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestResponseDto {
  @ApiProperty({ description: '처리 결과 메시지' })
  message: string;
}
