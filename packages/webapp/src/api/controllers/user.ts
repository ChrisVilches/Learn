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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class UserController {
  @Get('/me')
  @ApiOperation({ summary: 'User profile and related data' })
  async me(@Req() { user }): Promise<User> {
    return user;
  }
}
