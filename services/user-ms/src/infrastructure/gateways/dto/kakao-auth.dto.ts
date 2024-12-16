import { ApiProperty } from '@nestjs/swagger';

/**
 * 카카오 OAuth 토큰 응답 DTO
 * (POST https://kauth.kakao.com/oauth/token)
 */
export class KakaoTokenResponseDto {
  @ApiProperty({ description: '카카오 Access Token' })
  access_token: string;

  @ApiProperty({ description: '카카오 Refresh Token' })
  refresh_token: string;

  @ApiProperty({ description: 'Access Token 만료 시간(초)' })
  expires_in: number;

  @ApiProperty({ description: 'Refresh Token 만료 시간(초)' })
  refresh_token_expires_in: number;

  @ApiProperty({ description: '토큰 타입' })
  token_type: string;

  // 카카오 측에서 추가로 내려줄 수 있는 필드들 (id_token, scope 등)
  // @ApiProperty({ description: 'OpenID Connect id_token', required: false })
  // id_token?: string;
}

/**
 * 카카오 유저 프로필 응답 DTO
 * (GET https://kapi.kakao.com/v2/user/me)
 */
export class KakaoUserProfileResponseDto {
  @ApiProperty({ description: '카카오 내부 회원번호' })
  id: number;

  @ApiProperty({
    description: '카카오 계정 정보 (이메일, 프로필 등)',
    required: false,
  })
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      // 기타 프로필 필드
    };
    email?: string;
    // 기타 카카오 계정 필드
  };
}

/**
 * 최종적으로 백엔드가 발급해 줄 토큰/UUID
 */
export class KakaoAuthResultDto {
  @ApiProperty({ description: '백엔드가 발급한 유저 UUID' })
  userUuid: string;

  @ApiProperty({ description: 'Kakao 발급한 유저 UUID' })
  userSocialId: string;

  @ApiProperty({ description: '백엔드가 발급한 액세스 토큰' })
  accessToken: string;

  @ApiProperty({ description: '백엔드가 발급한 리프레시 토큰' })
  refreshToken: string;
}
