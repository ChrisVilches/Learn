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
import { random, range } from 'lodash';

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

  @Get('/recent_activity')
  @ApiOperation({ summary: 'Get user recent activity' })
  async recentActivity() {
    const someMonthsAgo = new Date();
    someMonthsAgo.setMonth(someMonthsAgo.getMonth() - 6);

    // TODO: Data is hardcoded
    // TODO: Implement the one for the calendar heatmap.
    // TODO: The `skillScore` data is unused in the frontend, for now.
    return {
      skillScore: [
        { category: 'Linear Algebra', score: random(2, 8) },
        { category: 'Algorithms', score: random(2, 8) },
        { category: 'Calculus', score: random(2, 8) },
        { category: 'Statistics', score: random(2, 8) },
        { category: 'Probability', score: random(2, 8) },
        { category: 'Algebra', score: random(2, 8) },
      ],
      calendar: {
        fromDay: someMonthsAgo,
        problemsSolved: range(30 * 6).map(() => random(0, 20)),
      },
    };
  }
}
