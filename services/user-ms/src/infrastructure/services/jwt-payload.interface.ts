export interface JwtPayload {
  userUuid: string;      // 유저 고유 UUID
  iat?: number;          // issued at (JWT 표준 클레임)
  exp?: number;          // 만료 시점 (JWT 표준 클레임)
}