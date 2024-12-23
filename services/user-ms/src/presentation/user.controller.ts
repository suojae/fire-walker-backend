import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserUsecase } from '../domain/user.usecase';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import {
  FriendRequestNotificationRequestDto,
  FriendRequestNotificationResponseDto,
} from './dto/friend-request-notification-request.dto';
import {
  FriendAcceptNotificationRequestDto,
  FriendAcceptNotificationResponseDto,
} from './dto/friend-accept-notification-request.dto';
import {
  UpdateNicknameRequestDto,
  UpdateNicknameResponseDto,
} from './dto/update-nickname.dto';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

  /**
   * 회원가입
   */
  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '성공',
    headers: {
      Authorization: {
        description: 'Access Token',
        schema: { type: 'string' },
      },
      'X-Refresh-Token': {
        description: 'Refresh Token',
        schema: { type: 'string' },
      },
    },
    type: SignUpResponseDto,
  })
  async signUpWithKakao(
    @Body() signUpRequestDto: SignUpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignUpResponseDto> {
    const tokenEntity = await this.userUsecase.signUp(
      signUpRequestDto.socialId,
    );

    res.setHeader('Authorization', `Bearer ${tokenEntity.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', tokenEntity.getRefreshToken());

    return { message: 'Signup 성공!' };
  }

  /**
   * Access Token 검증 (간단한 SignIn 예시)
   */
  @Post('signin')
  @ApiOperation({ summary: 'Access Token 검증' })
  @ApiResponse({
    status: 201,
    description: '성공',
    headers: {
      Authorization: {
        description: 'Access Token',
        schema: { type: 'string' },
      },
      'X-Refresh-Token': {
        description: 'Refresh Token',
        schema: { type: 'string' },
      },
    },
    type: SignInResponseDto,
  })
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDto> {
    const tokenEntity = await this.userUsecase.verifyAccessToken(
      signInRequestDto.accessToken,
    );

    res.setHeader('Authorization', `Bearer ${tokenEntity.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', tokenEntity.getRefreshToken());

    return { message: 'SignIn 성공!' };
  }

  /**
   * [4] 로그아웃
   */
  @Post('signout')
  @ApiOperation({ summary: '카카오 로그아웃 (세션 만료)' })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  async signout(@Body() dto: { userId: string }): Promise<{ message: string }> {
    const { userId } = dto;
    await this.userUsecase.signout(userId);
    return { message: `카카오 유저(${userId}) 로그아웃 완료` };
  }

  /**
   * [6] 회원탈퇴
   */
  @Post('delete')
  @ApiOperation({ summary: '카카오 회원탈퇴 (연결 해제)' })
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  async deleteUser(
    @Body() dto: { userId: string },
  ): Promise<{ message: string }> {
    const { userId } = dto;
    await this.userUsecase.deleteAccount(userId);
    return { message: `카카오 유저(${userId}) 계정 탈퇴 완료` };
  }

  /**
   * 토큰 재발급 (RTR)
   */
  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급 (RTR)' })
  @ApiResponse({
    status: 201,
    description: '성공',
    headers: {
      Authorization: {
        description: 'Access Token',
        schema: { type: 'string' },
      },
      'X-Refresh-Token': {
        description: 'Refresh Token',
        schema: { type: 'string' },
      },
    },
    type: RefreshResponseDto,
  })
  async refresh(
    @Body() dto: RefreshRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const newTokens = await this.userUsecase.refreshTokens(dto.refreshToken);

    res.setHeader('Authorization', `Bearer ${newTokens.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', newTokens.getRefreshToken());

    return {
      accessToken: newTokens.getAccessToken(),
      refreshToken: newTokens.getRefreshToken(),
    };
  }

  /**
   * [9] FCM 토큰 업데이트
   */
  @Put('fcm-token')
  @ApiOperation({ summary: '유저 FCM 토큰 업데이트' })
  @ApiResponse({ status: 200, description: '성공' })
  async updateFcmToken(@Body() body: { userUuid: string; fcmToken: string }) {
    const { userUuid, fcmToken } = body;
    await this.userUsecase.updateFcmToken(userUuid, fcmToken);
    return { message: 'FCM 토큰이 업데이트되었습니다.' };
  }

  /**
   * [10] 친구 요청 알림 전송
   */
  @Post('friend/request')
  @ApiOperation({ summary: '친구 요청 알림 전송' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: FriendRequestNotificationResponseDto,
  })
  async friendRequest(
    @Body() dto: FriendRequestNotificationRequestDto,
  ): Promise<FriendRequestNotificationResponseDto> {
    const message = await this.userUsecase.friendRequest(
      dto.senderNickname,
      dto.friendNickname,
    );
    return { message };
  }

  /**
   * 친구 요청 수락 알림 전송
   */
  @Post('friend/accept')
  @ApiOperation({ summary: '친구 요청 수락 알림 전송' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: FriendAcceptNotificationResponseDto,
  })
  async friendAccept(
    @Body() dto: FriendAcceptNotificationRequestDto,
  ): Promise<FriendAcceptNotificationResponseDto> {
    const message = await this.userUsecase.friendAccept(
      dto.recipientNickname,
      dto.friendNickname,
    );
    return { message };
  }

  /**
   * 친구 목록 조회 (닉네임 기반)
   */
  @Get('friend/list/:nickname')
  @ApiOperation({ summary: '친구 목록 조회' })
  async getFriendList(@Param('nickname') nickname: string) {
    const friendUuids = await this.userUsecase.findMyFriends(nickname);
    return { friendUuids };
  }

  /**
   * 유저 닉네임 업데이트
   */
  @Put('nickname')
  @ApiOperation({ summary: '유저 닉네임 업데이트' })
  @ApiResponse({
    status: 201,
    description: '닉네임 업데이트 성공',
    type: UpdateNicknameResponseDto,
  })
  async updateNickname(
    @Body() body: UpdateNicknameRequestDto,
  ): Promise<UpdateNicknameResponseDto> {
    const { userUuid, newNickname } = body;
    await this.userUsecase.updateNickname(userUuid, newNickname);
    return { message: '닉네임이 업데이트되었습니다.' };
  }
}
