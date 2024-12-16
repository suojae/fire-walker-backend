export interface JwtPayload {
  userUuid: string;      // 유저 고유 UUID
  provider?: string;     // 소셜 타입(kakao, apple)
  iat?: number;          // issued at (JWT 표준 클레임)
  exp?: number;          // 만료 시점 (JWT 표준 클레임)
}