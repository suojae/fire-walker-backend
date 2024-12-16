import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { UserUsecase } from '../domain/user.usecase';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserUsecase) {}

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
    const tokenEntity = await this.userService.signUpWithKakao(signUpRequestDto.authCode);

    // 1) Access Token을 헤더로 내려주기
    res.setHeader('Authorization', `Bearer ${tokenEntity.getAccessToken()}`);

    // 2) Refresh Token도 헤더로 내려주기 (커스텀 헤더)
    res.setHeader('X-Refresh-Token', tokenEntity.getRefreshToken());

    return {
      message: 'Signup 성공!',
    };
  }

  @Post('signin')
  @ApiOperation({ summary: '이미 발급된 Access Token 인증' })
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
    const tokenEntity = await this.userService.verifyAccessToken(signInRequestDto.accessToken);

    res.setHeader('Authorization', `Bearer ${tokenEntity.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', tokenEntity.getRefreshToken());

    return { message: 'SignIn 성공!' };
  }

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
    const newTokens = await this.userService.refreshTokens(dto.refreshToken);

    res.setHeader('Authorization', `Bearer ${newTokens.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', newTokens.getRefreshToken());

    return {
      accessToken: newTokens.getAccessToken(),
      refreshToken: newTokens.getRefreshToken(),
    };
  }
}
