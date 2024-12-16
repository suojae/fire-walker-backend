import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiProperty({ example: 'nickname123', description: '변경할 닉네임' })
  nickname: string;
}
