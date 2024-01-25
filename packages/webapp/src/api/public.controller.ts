import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { loginSchema } from './schemas/login';
import { ZodPipe } from './pipes/zod';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/logic/services/user';
import { ErrorMappingInterceptor } from './interceptors/error-mapping';

@Controller()
@UseInterceptors(new ErrorMappingInterceptor())
export class PublicController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: This is a fake login.
  @Post('/login')
  async login(
    @Body(new ZodPipe(loginSchema)) signInData: { email: string },
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserByEmail(signInData.email);

    if (user === null) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync({ email: user.email }),
    };
  }
}
