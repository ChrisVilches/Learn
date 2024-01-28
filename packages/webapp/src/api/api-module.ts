import { Module } from '@nestjs/common';
import { ProblemController } from './controllers/problem';
import { LogicModule } from '../logic/logic-module';
import { CategoryController } from './controllers/category';
import { UserController } from './controllers/user';
import { AuthModule } from '../auth/auth-module';

@Module({
  imports: [AuthModule, LogicModule],
  controllers: [UserController, ProblemController, CategoryController],
  providers: [],
})
export class ApiModule {}
