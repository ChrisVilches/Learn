import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorMappingInterceptor } from '../interceptors/error-mapping';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt';

// TODO: Type of "user" set by Nest might not match with the "User" in Prisma, so refactor.

@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class UserController {
  @Get('/me')
  async me(@Req() { user }): Promise<User> {
    return user;
  }
}
