import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//TODO: 향후 env 파일 적용하기
@Injectable()
export class KakaoAuthConfig {
  constructor(private readonly configService: ConfigService) {}

  get clientId(): string {
    return this.configService.get<string>('KAKAO_CLIENT_ID', '');
  }

  get clientSecret(): string {
    return this.configService.get<string>('KAKAO_CLIENT_SECRET', '');
  }

  get redirectUri(): string {
    return this.configService.get<string>('KAKAO_REDIRECT_URI', '');
  }

  get tokenUrl(): string {
    return 'https://kauth.kakao.com/oauth/token';
  }

  get userInfoUrl(): string {
    return 'https://kapi.kakao.com/v2/user/me';
  }
}
