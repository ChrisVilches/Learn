import { type PipeTransform } from '@nestjs/common';
import { ZodError, type z, type ZodSchema } from 'zod';

// NOTE: Due to `ErrorMappingInterceptor`, errors caused by Zod will be explained
//       to the user, but some ZodError errors are thrown by the business logic (as opposed to
//       by pipes), therefore contain sensitive information and must not be leaked to the
//       user via the interceptor. Therefore, this error class is used instead of ZodError in
//       order to wrap errors that are safe to show the user (mainly the ones thrown by the
//       zod validation pipe).
export class ZodPipeError {
  constructor(readonly zodError: ZodError) {}
}

export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown): z.infer<typeof this.schema> {
    try {
      return this.schema.parse(value);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        throw new ZodPipeError(e);
      }

      throw e;
    }
  }
}
