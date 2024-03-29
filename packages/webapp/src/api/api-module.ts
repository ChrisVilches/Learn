import { Module } from '@nestjs/common';
import { ProblemController } from './controllers/problem';
import { LogicModule } from '../logic/logic-module';
import { CategoryController } from './controllers/category';
import { UserController } from './controllers/user';
import { AuthModule } from '../auth/auth-module';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

const envSchema = z.object({
  NODE_ENV: z
    .literal('development')
    .or(z.literal('test'))
    .or(z.literal('production')),
  DATABASE_URL: z.string().url(),
  SECRET_KEY: z.string().min(10),
  PYTHON_CMD: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => {
        return envSchema.parse(config);
      },
    }),
    AuthModule,
    LogicModule,
    CacheModule.register(),
  ],
  controllers: [UserController, ProblemController, CategoryController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class ApiModule {}
