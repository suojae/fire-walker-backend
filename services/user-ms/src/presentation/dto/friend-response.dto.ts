import { ApiProperty } from '@nestjs/swagger';

export class FriendRequestNotificationResponseDto {
  @ApiProperty({ description: '처리 결과 메시지' })
  message: string;
}
