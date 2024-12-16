import { ApiProperty } from '@nestjs/swagger';

// Notification-MS로부터 돌아오는 Response DTO
export class NotificationResponseDto {
  @ApiProperty({ description: '처리 결과 메시지' })
  message: string;
}
