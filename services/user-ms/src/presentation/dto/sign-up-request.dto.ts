import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    example: 'abc123authcode',
    description: '소셜 서버에서 발급받은 socialId (카카오/애플 등)',
  })
  @IsString()
  socialId: string;
}

