import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGateway } from '../infrastructure/gateways/auth.gateway';
import { TokenEntity } from './token.entity';
import { TokenService } from '../infrastructure/services/token.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserUsecase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly tokenService: TokenService,
  ) {}

  async signUpWithKakao(authcode: string): Promise<TokenEntity> {
    const result = await this.authGateway.signUpWithKakao(authcode);

    return new TokenEntity({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  verifyAccessToken(accessToken: string): JwtPayload {
    try {
      return this.tokenService.verifyToken(accessToken); // { userUuid, provider, iat, exp }
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired access token: ${error}`,
      );
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokenEntity> {
    try {
      // 1) Refresh Token 검증
      const payload = this.tokenService.verifyToken(refreshToken);
      // payload.userUuid, payload.provider 등

      // 2) RTR이라서 이전 Refresh Token 무효화 로직 필요
      //    (예: DB/Redis에서 이 refreshToken이 이미 쓰인 토큰인지 검사하고 폐기 표기)
      //    단순 예시로는 생략

      // 3) 새 Access Token과 새 Refresh Token 발급
      const newAccessToken = this.tokenService.generateAccessToken({
        userUuid: payload.userUuid,
        provider: payload.provider,
      });
      const newRefreshToken = this.tokenService.generateRefreshToken({
        userUuid: payload.userUuid,
        provider: payload.provider,
      });

      // 4) TokenEntity로 래핑해서 반환
      return new TokenEntity({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired refresh token: ${error}`,
      );
    }
  }
}
