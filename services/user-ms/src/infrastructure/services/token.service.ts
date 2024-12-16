import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class TokenService {
  private readonly JWT_SECRET = 'YOUR_JWT_SECRET';
  private readonly EXPIRES_IN = '1h';

  generateAccessToken(payload: JwtPayload): string {
    return sign(payload, this.JWT_SECRET, {
      expiresIn: this.EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return sign(payload, this.JWT_SECRET, {
      expiresIn: '14d',
    });
  }

  verifyToken(token: string): JwtPayload {
    const decoded = verify(token, this.JWT_SECRET);
    return decoded as JwtPayload;
  }
}
