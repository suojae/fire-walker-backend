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
  constructor(private readonly userService: UserUsecase) {
  }

  @Post('signup')
  @ApiResponse({ status: 201, description: '성공', type: SignUpResponseDto })
  @ApiOperation({ summary: '회원가입' })
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
  @ApiResponse({ status: 201, description: '성공', type: SignInResponseDto })
  @ApiOperation({ summary: '이미 발급된 Access Token 인증' })
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDto> {
    const tokenEntity = await this.userService.verifyAccessToken(signInRequestDto.accessToken);

    // 새 Access Token, Refresh Token이 필요하다면 헤더나 쿠키로 내려준다
    res.setHeader('Authorization', `Bearer ${tokenEntity.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', tokenEntity.getRefreshToken());

    return { message: 'SignIn 성공!' };
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 재발급 (RTR)' })
  @ApiResponse({ status: 201, description: '성공', type: RefreshResponseDto })
  async refresh(
    @Body() dto: RefreshRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const newTokens = await this.userService.refreshTokens(dto.refreshToken);

    // 새로 발급된 토큰도 헤더에 담아서 내려주기
    res.setHeader('Authorization', `Bearer ${newTokens.getAccessToken()}`);
    res.setHeader('X-Refresh-Token', newTokens.getRefreshToken());

    return {
      accessToken: newTokens.getAccessToken(),
      refreshToken: newTokens.getRefreshToken(),
    };
  }
}
