export interface TokenEntityProps {
  userUuid: string;
  accessToken: string;
  refreshToken: string;
}

export class TokenEntity {
  private readonly userUuid: string; // 유저와 연결된 UUID
  private accessToken: string; // 액세스 토큰
  private refreshToken: string; // 리프레시 토큰

  constructor(props: TokenEntityProps) {
    this.userUuid = props.userUuid;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }

  // Getter for User UUID
  public getUserUuid(): string {
    return this.userUuid;
  }

  // Getter for Access Token
  public getAccessToken(): string {
    return this.accessToken;
  }

  // Getter for Refresh Token
  public getRefreshToken(): string {
    return this.refreshToken;
  }

  // Setter for Access Token
  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  // Setter for Refresh Token
  public setRefreshToken(token: string): void {
    this.refreshToken = token;
  }
}
