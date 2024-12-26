import { plainToInstance } from 'class-transformer';

export interface UserEntityProps {
  uuid: string;
  socialId: string;
  nickName: string;
  fcmToken?: string;
  dailyTargetStep: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  private readonly uuid: string;
  private readonly socialId: string;
  private nickName: string;
  private fcmToken?: string;
  private dailyTargetStep: number;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(props: UserEntityProps) {
    this.uuid = props.uuid;
    this.socialId = props.socialId;
    this.nickName = props.nickName;
    this.dailyTargetStep = props.dailyTargetStep;
    this.fcmToken = props.fcmToken;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static create(data: Partial<UserEntity>): UserEntity {
    return plainToInstance(UserEntity, data);
  }


  getDailyTargetStep(): number {
    return this.dailyTargetStep;
  }

  setDailyTargetStep(step: number): this {
    if (step < 0) {
      throw new Error('Daily target step must be a positive number.');
    }
    this.dailyTargetStep = step;
    this.updateTimestamp();
    return this;
  }
  // Getter / Setter
  getUuid(): string {
    return this.uuid;
  }

  getSocialId(): string {
    return this.socialId;
  }

  getNickName(): string {
    return this.nickName;
  }

  getFcmToken(): string {
    return <string>this.fcmToken;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setNickName(nickName: string): this {
    if (!nickName || nickName.trim().length < 3) {
      throw new Error('닉네임은 최소 3글자 이상이여야 합니다.');
    }
    this.nickName = nickName.trim();
    this.updateTimestamp();
    return this;
  }

  /**
   * FCM 토큰 업데이트
   */
  setFcmToken(fcmToken: string): this {
    if (!fcmToken || fcmToken.trim().length === 0) {
      throw new Error('유효하지 않은 FCM 토큰입니다.');
    }
    this.fcmToken = fcmToken.trim();
    this.updateTimestamp();
    return this;
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
