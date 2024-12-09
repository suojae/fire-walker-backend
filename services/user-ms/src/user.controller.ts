import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile() {
    console.log('User profile endpoint called');
    return { username: 'dummy_user', steps: 1000 };
  }
}
