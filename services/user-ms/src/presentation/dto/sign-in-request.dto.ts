import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: '이미 발급받은 Access Token',
  })
  accessToken: string;
}
