import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameRequestDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: '유저 UUID' })
  userUuid: string;

  @ApiProperty({ example: 'newNickname', description: '새로운 닉네임' })
  newNickname: string;
}

export class UpdateNicknameResponseDto {
  @ApiProperty({ example: '닉네임이 업데이트되었습니다.', description: '결과 메시지' })
  message: string;
}
