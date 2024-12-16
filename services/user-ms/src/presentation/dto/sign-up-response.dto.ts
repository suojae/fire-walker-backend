import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({
    example: 'success',
    description: '요청 처리 상태 메시지',
  })
  message: string;
}
