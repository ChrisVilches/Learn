import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt';
import { LocalStrategy } from './strategies/local';
import { LogicModule } from '../logic/logic-module';
import { AuthService } from './services/auth';

@Module({
  exports: [LocalStrategy, JwtStrategy],
  imports: [
    PassportModule,
    LogicModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      // TODO: Article about token refreshing, and why expiration should be short:
      //       https://security.stackexchange.com/questions/119371/is-refreshing-an-expired-jwt-token-a-good-strategy
      //       NOTE: Low priority, since I'm not going to implement a full login system yet.
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
