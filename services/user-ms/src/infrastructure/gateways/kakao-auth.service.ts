import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { KakaoAuthConfig } from './kakao-auth.config';
import { TokenService } from '../services/token.service';
import {
  KakaoAuthResultDto,
  KakaoTokenResponseDto,
  KakaoUserProfileResponseDto,
} from './dto/kakao-auth.dto';

@Injectable()
export class KakaoAuthService {
  private readonly logger = new Logger(KakaoAuthService.name);

  constructor(
    private readonly kakaoConfig: KakaoAuthConfig,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * 카카오로부터 발급받은 authCode로 최종 백엔드 토큰과 userUuid를 생성
   */
  async authenticate(authCode: string): Promise<KakaoAuthResultDto> {
    this.logger.log(
      `KakaoAuthService.authenticate called with authCode=${authCode}`,
    );

    // 1) authCode를 이용해 카카오 Access Token 받기
    const tokenResponse = await this.getKakaoTokenFromCode(authCode);

    // 2) 카카오 Access Token으로 카카오 유저 프로필 가져오기
    const userProfile = await this.getKakaoUserProfile(
      tokenResponse.access_token,
    );

    const userUuid = uuidv4();

    // 4) 백엔드 자체 Access Token과 Refresh Token 발급
    const backendAccessToken = this.tokenService.generateAccessToken({
      userUuid,
      provider: 'kakao',
    });
    const backendRefreshToken = this.tokenService.generateRefreshToken({
      userUuid,
      provider: 'kakao',
    });

    return {
      userUuid,
      userSocialId: userProfile.id.toString(),
      accessToken: backendAccessToken,
      refreshToken: backendRefreshToken,
    };
  }

  /**
   * 카카오 authCode -> 카카오 Access Token, Refresh Token 교환
   */
  private async getKakaoTokenFromCode(
    code: string,
  ): Promise<KakaoTokenResponseDto> {
    this.logger.debug(`getKakaoTokenFromCode: code=${code}`);
    const url = this.kakaoConfig.tokenUrl;

    // OAuth2 표준 형식: grant_type=authorization_code
    const params = {
      grant_type: 'authorization_code',
      client_id: this.kakaoConfig.clientId,
      redirect_uri: this.kakaoConfig.redirectUri,
      code,
    };

    // client_secret 사용 설정했다면 추가 현재의 경우 client_secret 기능 off한 상태
    // const clientSecret = this.kakaoConfig.clientSecret;
    // if (clientSecret) {
    //   params['client_secret'] = clientSecret;
    // }

    try {
      const response = await axios.post<KakaoTokenResponseDto>(url, null, {
        params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Kakao token: ${error}`);
      throw error;
    }
  }

  /**
   * 카카오 Access Token으로 카카오 유저 프로필 조회
   */
  private async getKakaoUserProfile(
    accessToken: string,
  ): Promise<KakaoUserProfileResponseDto> {
    this.logger.debug(
      `getKakaoUserProfile with accessToken=${accessToken.slice(0, 10)}...`,
    );
    const url = this.kakaoConfig.userInfoUrl;

    try {
      const response = await axios.get<KakaoUserProfileResponseDto>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Kakao user profile: ${error}`);
      throw error;
    }
  }
}
