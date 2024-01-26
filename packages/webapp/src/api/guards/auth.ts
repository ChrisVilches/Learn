import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type User } from '@prisma/client';
import { UserService } from '../../logic/services/user';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { IncomingMessage } from 'http';

const payloadSchema = z.object({ email: z.string().email() });

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IncomingMessage>();

    try {
      const token = this.extractTokenFromHeader(request);
      const payload = await this.jwtService.verifyAsync(token);
      const userCtx = context.switchToHttp().getRequest<{ user: User }>();
      const payloadParsed = payloadSchema.parse(payload);
      userCtx.user = await this.ensureFetchUserByEmail(payloadParsed.email);
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

  private extractTokenFromHeader(request: IncomingMessage): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return token;
  }
}
