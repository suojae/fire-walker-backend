import { ApiProperty } from '@nestjs/swagger';

export class RefreshRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8...',
    description: '기존 Refresh Token',
  })
  refreshToken: string;
}
