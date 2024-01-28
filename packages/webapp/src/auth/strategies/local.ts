import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth';

// TODO: research what's the concept of the "local" strategy. Am I doing this OK?

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    // TODO: I think if I remove this, then auth/login controller has no "@Request { user }",
    //       But I'm not sure.
    return user;
  }
}
