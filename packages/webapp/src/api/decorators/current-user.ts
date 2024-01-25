import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { type User } from '@prisma/client';
import { z } from 'zod';

const userContextSchema = z.object({
  id: z.number().positive().int(),
  email: z.string().email(),
  userName: z.string(),
});

export const CurrentUser = createParamDecorator<any, any, User>(
  (_data: unknown, ctx: ExecutionContext) => {
    const userCtx = ctx.switchToHttp().getRequest<{ user: User }>();
    const parsed = userContextSchema.safeParse(userCtx.user);

    if (parsed.success) {
      return userCtx.user;
    } else {
      throw new Error(
        "(Unrecoverable server error) Current user was not set correctly (at this point the user should've been set)",
      );
    }
  },
);
