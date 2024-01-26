import { Module } from '@nestjs/common';
import { ProblemController } from './controllers/problem';
import { LogicModule } from 'src/logic/logic.module';
import { JwtModule } from '@nestjs/jwt';
import { PublicController } from './controllers/public';
import { CategoryController } from './controllers/category';
import { UserController } from './controllers/user';

@Module({
  imports: [
    LogicModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [
    PublicController,
    UserController,
    ProblemController,
    CategoryController,
  ],
  providers: [],
})
export class ApiModule {}
