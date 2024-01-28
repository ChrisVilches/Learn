import { Module } from '@nestjs/common';
import { ProblemService } from './services/problem';
import { UserService } from './services/user';
import { PrismaService } from './services/prisma';
import { CategoryService } from './services/category';
import { DataCheck } from './data-check';

@Module({
  providers: [
    PrismaService,
    CategoryService,
    ProblemService,
    UserService,
    DataCheck,
  ],
  exports: [CategoryService, ProblemService, UserService, PrismaService],
})
export class LogicModule {}
