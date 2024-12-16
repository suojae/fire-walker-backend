export type Provider = 'kakao' | 'apple';

export class UserEntity {
  private readonly uuid: string; // 유저 고유 식별자
  private readonly socialId: string; // 소셜 로그인 ID
  private readonly provider: Provider; // 소셜 로그인 제공자
  private nickName: string; // 닉네임
  private createdAt: Date; // 생성 시간
  private updatedAt: Date; // 수정 시간

  constructor(
    uuid: string,
    socialId: string,
    provider: Provider,
    nickName: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.uuid = uuid;
    this.socialId = socialId;
    this.provider = provider;
    this.nickName = nickName;
    this.createdAt = createdAt || new Date(); // 기본값: 현재 시간
    this.updatedAt = updatedAt || new Date(); // 기본값: 현재 시간
  }

  // Getter for UUID
  public getUuid(): string {
    return this.uuid;
  }

  // Getter for Social ID
  public getSocialId(): string {
    return this.socialId;
  }

  // Getter for Provider
  public getProvider(): Provider {
    return this.provider;
  }

  // Getter for NickName
  public getNickName(): string {
    return this.nickName;
  }

  // Getter for Created At
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // Getter for Updated At
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setter for NickName
  public setNickName(nickName: string): this {
    if (!nickName || nickName.trim().length < 3) {
      throw new Error('닉네임은 최소 3글자 이상.');
    }
    this.nickName = nickName.trim();
    this.updateTimestamp();
    return this;
  }

  // Update timestamps
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  // 도메인 비즈니스 로직 예시: 프로필 업데이트
  public updateProfile(nickName: string): this {
    return this.setNickName(nickName);
  }
}
