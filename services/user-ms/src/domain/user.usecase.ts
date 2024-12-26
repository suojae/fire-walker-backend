import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationGateway } from '../infrastructure/gateways/notification.gateway';
import { TokenService } from '../infrastructure/services/token.service';
import { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { FriendshipRepository } from '../infrastructure/repositories/friendship.repository';
import { TokenEntity } from './token.entity';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserOrmEntity } from '../infrastructure/repositories/dao/user.orm-entity';

@Injectable()
export class UserUsecase {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly friendshipRepository: FriendshipRepository,
  ) {}

  // ----------------------------------------------------------------
  // [카카오 + 애플] 회원가입
  // ----------------------------------------------------------------
  async signUp(socialId: string): Promise<TokenEntity> {
    const userUuid = uuidv4();

    const user = new UserEntity({
      uuid: userUuid,
      socialId: socialId,
      dailyTargetStep: 0,
      nickName: '',
    });

    await this.userRepository.saveUser(user);

    const accessToken = this.tokenService.generateAccessToken({
      userUuid,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      userUuid,
    });

    return new TokenEntity({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  // ----------------------------------------------------------------
  // [Access Token 검증, Refresh 토큰 재발급]
  // ----------------------------------------------------------------
  verifyAccessToken(accessToken: string): TokenEntity {
    try {
      this.tokenService.verifyToken(accessToken) as JwtPayload;
      return new TokenEntity({ accessToken, refreshToken: '' });
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired access token: ${error}`,
      );
    }
  }

  async refreshTokens(oldRefreshToken: string): Promise<TokenEntity> {
    const userId = this.tokenService.verifyToken(oldRefreshToken).userUuid;
    const storedToken = await this.userRepository.getRefreshToken(userId);
    if (!storedToken || storedToken !== oldRefreshToken) {
      throw new Error('Refresh token mismatch or expired');
    }

    const newRefreshToken = 'new-refresh-token';
    await this.userRepository.saveRefreshToken(userId, newRefreshToken);

    const newAccessToken = 'new-access-token';
    return new TokenEntity({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

  // ----------------------------------------------------------------
  // [카카오 + 애플] 로그아웃
  // ----------------------------------------------------------------
  async signout(userId: string): Promise<void> {
    await this.userRepository.deleteRefreshToken(userId);
  }

  // ----------------------------------------------------------------
  // [카카오 + 애플] 회원탈퇴
  // ----------------------------------------------------------------
  async deleteAccount(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
    await this.userRepository.deleteRefreshToken(userId);
  }

  // ----------------------------------------------------------------
  // [유저 정보 업데이트, FCM 토큰]
  // ----------------------------------------------------------------
  async updateFcmToken(userUuid: string, fcmToken: string): Promise<void> {
    const user = await this.userRepository.findUserByUuid(userUuid);
    if (!user) {
      throw new NotFoundException(`User not found: ${userUuid}`);
    }
    user.setFcmToken(fcmToken);
    await this.userRepository.saveUser(user);
  }

  // ----------------------------------------------------------------
  // [친구 요청/수락, 목록 조회]
  // ----------------------------------------------------------------
  async friendRequest(
    senderNickname: string,
    friendNickname: string,
  ): Promise<string> {
    const friendUser =
      await this.userRepository.findUserByNickname(friendNickname);
    if (!friendUser) {
      throw new NotFoundException(`Friend user not found: ${friendNickname}`);
    }
    const senderUser =
      await this.userRepository.findUserByNickname(senderNickname);
    if (!senderUser) {
      throw new NotFoundException(`Sender user not found: ${senderNickname}`);
    }
    const existing = await this.friendshipRepository.findFriendship(
      senderUser.getUuid(),
      friendUser.getUuid(),
    );
    if (existing) {
      throw new Error('이미 친구 요청이 존재합니다.');
    }
    await this.friendshipRepository.createFriendship(
      senderUser.getUuid(),
      friendUser.getUuid(),
    );
    const tokens = friendUser.getFcmToken() ? [friendUser.getFcmToken()] : [];
    return this.sendFriendRequestNotification(senderNickname, tokens);
  }

  async friendAccept(
    recipientNickname: string,
    friendNickname: string,
  ): Promise<string> {
    const friendUser =
      await this.userRepository.findUserByNickname(friendNickname);
    if (!friendUser) {
      throw new NotFoundException(`Friend user not found: ${friendNickname}`);
    }
    const recipientUser =
      await this.userRepository.findUserByNickname(recipientNickname);
    if (!recipientUser) {
      throw new NotFoundException(
        `Recipient user not found: ${recipientNickname}`,
      );
    }
    const friendship = await this.friendshipRepository.findFriendship(
      friendUser.getUuid(),
      recipientUser.getUuid(),
    );
    if (!friendship) {
      throw new NotFoundException('친구 요청이 존재하지 않습니다.');
    }
    if (friendship.status !== 'PENDING') {
      throw new Error(
        `현재 상태가 PENDING이 아니라서 수락할 수 없습니다. (status=${friendship.status})`,
      );
    }
    await this.friendshipRepository.updateStatus(friendship.id, 'ACCEPTED');

    const tokens = friendUser.getFcmToken() ? [friendUser.getFcmToken()] : [];
    return this.sendFriendAcceptNotification(recipientNickname, tokens);
  }

  async findMyFriends(userId: string): Promise<string[]> {
    const rows = await this.friendshipRepository.findAllFriendships(userId);
    const acceptedRows = rows.filter((r) => r.status === 'ACCEPTED');
    return acceptedRows.map((r) =>
      r.userUuid === userId ? r.friendUuid : r.userUuid,
    );
  }

  // ----------------------------------------------------------------
  // [유저 정보 업데이트]
  // ----------------------------------------------------------------
  async updateUserInfo(
    userUuid: string,
    updateData: Partial<{ nickName: string; fcmToken: string; dailyTargetStep: number }>, // 필드 추가
  ): Promise<void> {
    const user = await this.userRepository.findUserByUuid(userUuid);
    if (!user) {
      throw new NotFoundException(`User not found: ${userUuid}`);
    }

    const updatePayload: Partial<UserOrmEntity> = {};

    // 업데이트 데이터 적용
    if (updateData.nickName) {
      updatePayload.nickName = updateData.nickName;
    }
    if (updateData.fcmToken) {
      updatePayload.fcmToken = updateData.fcmToken;
    }
    if (updateData.dailyTargetStep !== undefined) {
      updatePayload.dailyTargetStep = updateData.dailyTargetStep;
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new Error('No valid update data provided.');
    }

    // 업데이트 메서드 호출
    await this.userRepository.updateUserInfo(userUuid, updatePayload);
  }


  // ----------------------------------------------------------------
  // [Private Helper]
  // ----------------------------------------------------------------
  private async sendFriendRequestNotification(
    senderNickname: string,
    tokens: string[],
  ): Promise<string> {
    const response =
      await this.notificationGateway.sendFriendRequestNotification({
        senderNickname,
        tokens,
      });
    return response.message;
  }

  private async sendFriendAcceptNotification(
    recipientNickname: string,
    tokens: string[],
  ): Promise<string> {
    const response =
      await this.notificationGateway.sendFriendAcceptNotification({
        recipientNickname,
        tokens,
      });
    return response.message;
  }
}
