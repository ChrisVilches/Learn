import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { LogicModule } from 'src/logic/logic.module';
import { JwtModule } from '@nestjs/jwt';
import { PublicController } from './public.controller';

@Module({
  imports: [
    LogicModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [ApiController, PublicController],
  providers: [],
})
export class ApiModule {}
