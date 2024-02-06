import {
  Controller,
  Get,
  Inject,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorMappingInterceptor } from '../interceptors/error-mapping';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProblemService } from '../../logic/services/problem';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { isNil } from 'lodash';

const STATS_CACHE_TIME_MS = 1000 * 60 * 5;

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(new ErrorMappingInterceptor())
export class UserController {
  constructor(
    private readonly problemService: ProblemService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/me')
  @ApiOperation({ summary: 'User profile and related data' })
  async me(@Req() { user }): Promise<User> {
    return user;
  }

  @Get('/recent_activity')
  @ApiOperation({ summary: 'Get user recent activity' })
  async recentActivity(@Req() { user }) {
    const cacheKey = `recentActivity_${user.id}`;

    let result: Record<string, number> | undefined =
      await this.cacheManager.get(cacheKey);

    if (isNil(result)) {
      result = await this.problemService.getUserSolvedStats(user.id, 30 * 6);
      await this.cacheManager.set(cacheKey, result, STATS_CACHE_TIME_MS);
    }

    return {
      daysStats: Object.entries(result).map(([k, count]) => ({
        date: k,
        count,
      })),
    };
  }
}
