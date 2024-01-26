import { Module } from '@nestjs/common';
import { ProblemService } from './services/problem';
import { UserService } from './services/user';
import { PrismaService } from './services/prisma';
import { CategoryService } from './services/category';
import { DataCheck } from './data-check';

@Module({
  imports: [],
  providers: [
    ProblemService,
    UserService,
    CategoryService,
    PrismaService,
    DataCheck,
  ],
  exports: [ProblemService, UserService, CategoryService],
})
export class LogicModule {}
