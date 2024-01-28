import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local';
import { AuthService } from '../services/auth';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() { user }) {
    return this.authService.login(user);
  }
}
