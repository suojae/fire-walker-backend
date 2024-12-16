import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '유저 UUID',
  })
  userId: string;

  @ApiProperty({ example: 'nickname123', description: '현재 유저 닉네임' })
  nickname: string;
}
