import { Injectable } from '@nestjs/common';
import { KakaoAuthService } from './kakao-auth.service';
import { KakaoAuthResultDto } from './dto/kakao-auth.dto';

@Injectable()
export class AuthGateway {
  constructor(private readonly kakaoAuthService: KakaoAuthService) {}

  async signUpWithKakao(authcode: string): Promise<KakaoAuthResultDto> {
    return this.kakaoAuthService.authenticate(authcode);
  }
}
