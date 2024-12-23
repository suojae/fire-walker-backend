import { ApiProperty } from '@nestjs/swagger';

export class SignOutRequestDto {
  @ApiProperty({ description: "example_user_uuid" })
  uuid: string;
}


export class SignOutResponseDto {
  @ApiProperty({ description: "회원탈퇴가 완료되었습니다" })
  message: string;
}
