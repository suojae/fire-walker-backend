import { IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateUserInfoRequestDto {
  @IsUUID()
  userUuid: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickName?: string;

  @IsOptional()
  @IsNumber()
  dailyTargetStep?: string;


  @IsOptional()
  @IsString()
  @MaxLength(255)
  fcmToken?: string;
}

export class UpdateUserInfoResponseDto {
  message: string;
}
