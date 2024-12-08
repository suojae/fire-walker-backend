import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('social-login')
  socialLogin() {
    console.log('Called social login endpoint');
    // 여기서 소셜 로그인 로직 대신 로그만 출력
    return { message: 'Social login success (dummy response)' };
  }
}
