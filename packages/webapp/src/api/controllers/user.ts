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
import { ProblemService } from '../../logic/services/problem';

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class UserController {
  constructor(private readonly problemService: ProblemService) {}

  @Get('/me')
  @ApiOperation({ summary: 'User profile and related data' })
  async me(@Req() { user }): Promise<User> {
    return user;
  }

  @Get('/recent_activity')
  @ApiOperation({ summary: 'Get user recent activity' })
  async recentActivity(@Req() { user }) {
    const stats = await this.problemService.getUserSolvedStats(user.id, 30 * 6);

    return {
      daysStats: Object.entries(stats).map(([k, count]) => ({
        date: k,
        count,
      })),
    };
  }
}
