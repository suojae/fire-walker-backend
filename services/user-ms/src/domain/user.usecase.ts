import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGateway } from '../infrastructure/gateways/auth.gateway';
import { TokenEntity } from './token.entity';
import { TokenService } from '../infrastructure/services/token.service';
import { JwtPayload } from 'jsonwebtoken';
import { UserEntity } from './user.entity';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Injectable()
export class UserUsecase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async signUpWithKakao(authcode: string): Promise<TokenEntity> {
    const result = await this.authGateway.signUpWithKakao(authcode);

    const user = new UserEntity({
      uuid: result.userUuid,
      socialId: result.userSocialId,
      provider: 'kakao',
      nickName: 'default', // 첫정회원가입시에는 default로 설
    });

    await this.userRepository.saveUser(user);

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

  async refreshTokens(oldRefreshToken: string): Promise<TokenEntity> {
    // Redis에서 oldRefreshToken 유효성 검증
    const userId = this.tokenService.verifyToken(oldRefreshToken).userUuid;
    const storedToken = await this.userRepository.getRefreshToken(userId);
    if (!storedToken || storedToken !== oldRefreshToken) {
      throw new Error('Refresh token mismatch or expired');
    }

    // RTR 회전: old Token 폐기 or 덮어쓰기
    const newRefreshToken = 'new-refresh-token';
    await this.userRepository.saveRefreshToken(userId, newRefreshToken);

    // 새 Access Token
    const newAccessToken = 'new-access-token';
    return new TokenEntity({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

    }
  }
}
