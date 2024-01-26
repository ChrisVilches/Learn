import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ErrorMappingInterceptor } from '../interceptors/error-mapping';
import { AuthGuard } from '../guards/auth';
import { CurrentUser } from '../decorators/current-user';
import { User } from '@prisma/client';

@Controller()
@UseGuards(AuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class UserController {
  @Get('/me')
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
