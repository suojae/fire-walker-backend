import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class TokenService {
  private readonly JWT_SECRET = 'your_jwt_secret'; // 로컬 테스트용 Secret
  private readonly ACCESS_TOKEN_EXPIRES_IN = '1h'; // Access Token 만료 시간
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh Token 만료 시간

  generateAccessToken(payload: JwtPayload): string {
    return sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  verifyToken(token: string): JwtPayload {
    const decoded = verify(token, this.JWT_SECRET);
    return decoded as JwtPayload;
  }
}
