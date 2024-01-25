import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../../logic/services/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = this.extractTokenFromHeader(request);
      const payload = await this.jwtService.verifyAsync(token);
      const userCtx = context.switchToHttp().getRequest<{ user: User }>();
      userCtx.user = await this.ensureFetchUserByEmail(payload.email);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private async ensureFetchUserByEmail(email: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (user === null) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return token;
  }
}
