import { type PipeTransform } from '@nestjs/common';
import { ZodError, type z, type ZodSchema } from 'zod';

// TODO: I think I should comment this at least. Why is this done this way.
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
