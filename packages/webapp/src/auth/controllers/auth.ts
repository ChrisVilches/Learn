import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local';
import { AuthService } from '../services/auth';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Authenticate user login credentials' })
  async login(@Req() { user }): Promise<{ accessToken: string }> {
    return this.authService.signUserToken(user.id, user.username);
  }
}
