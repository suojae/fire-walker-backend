import { plainToInstance } from 'class-transformer';

export type Provider = 'kakao' | 'apple';

export interface UserEntityProps {
  uuid: string;
  socialId: string;
  provider: Provider;
  nickName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  private readonly uuid: string; // 유저 고유 식별자
  private readonly socialId: string; // 소셜 로그인 ID
  private readonly provider: Provider; // 소셜 로그인 제공자
  private nickName: string; // 닉네임
  private createdAt: Date; // 생성 시간
  private updatedAt: Date; // 수정 시간

  constructor(props: UserEntityProps) {
    this.uuid = props.uuid;
    this.socialId = props.socialId;
    this.provider = props.provider;
    this.nickName = props.nickName;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(data: Partial<UserEntity>): UserEntity {
    return plainToInstance(UserEntity, data);
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

  // 프로필 업데이트
  public updateProfile(nickName: string): this {
    return this.setNickName(nickName);
  }
}
