import { ApiProperty } from '@nestjs/swagger';

export class FcmTokenResponseDto {
  @ApiProperty({
    description: '응답 메시지',
    example: 'FCM Token registered successfully',
  })
  message: string;
}
