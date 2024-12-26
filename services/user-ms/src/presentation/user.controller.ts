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

import { UpdateUserInfoRequestDto, UpdateUserInfoResponseDto } from './dto/update-user-info.dto';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

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
  async signUp(
    @Body() signUpRequestDto: SignUpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignUpResponseDto> {
    const tokenEntity = await this.userUsecase.signUp(signUpRequestDto.socialId);

    // 헤더에 JWT 추가
    res.setHeader('Authorization', `Bearer ${tokenEntity.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', tokenEntity.getRefreshToken());

    return { message: 'Signup 성공!' };
  }

  /**
   * Access Token 검증
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
   * 친구 요청 알림 전송
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
   * 친구 목록 조회
   */
  @Get('friend/list')
  @ApiOperation({ summary: '친구 목록 조회' })
  async getFriendList(@Param('userId') userId: string) {
    const friendUuids = await this.userUsecase.findMyFriends(userId);
    return { friendUuids };
  }

  /**
   * 유저 정보 업데이트
   */
  @Put('update')
  @ApiOperation({ summary: '유저 정보 업데이트' })
  @ApiResponse({
    status: 201,
    description: '유저 정보 업데이트 성공',
    type: UpdateUserInfoResponseDto,
  })
  async updateUserInfo(
    @Body() body: UpdateUserInfoRequestDto,
  ): Promise<UpdateUserInfoResponseDto> {
    const { userUuid, nickName, fcmToken } = body;
    await this.userUsecase.updateUserInfo(userUuid, { nickName, fcmToken });
    return { message: '유저 정보가 업데이트되었습니다.' };
  }
}
