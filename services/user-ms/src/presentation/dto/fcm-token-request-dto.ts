import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export  class FcmTokenRequestDto {
  @ApiProperty({
    description: '유저 ID',
    example: 'example-user-id',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'FCM 토큰',
    example: 'example-fcm-token',
  })
  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}