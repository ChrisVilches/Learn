import { Module } from '@nestjs/common';
import { ProblemService } from './services/problem';
import { UserService } from './services/user';
import { PrismaService } from './services/prisma';
import { CategoryService } from './services/category';
import { DataCheck } from './data-check';

// TODO: Not sure how this works. I can call Prisma services even without having to do NestJS related
//       providings/etc in modules. Can I just make this layer (logic folder) be outside of NestJS?
//       Do I have to provide anything? Does the Prisma client create several connections because I'm doing something wrong?
//       TODO: I think this confusion is fixed. Try again removing some things here and have it crash (that means it's necessary to
//             provide/export stuff).
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
