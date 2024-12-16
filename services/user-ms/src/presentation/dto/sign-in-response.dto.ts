import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({ example: 'SignIn 성공!' })
  message: string;
}
