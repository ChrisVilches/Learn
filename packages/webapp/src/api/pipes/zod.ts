import { type PipeTransform } from '@nestjs/common';
import { type z, type ZodSchema } from 'zod';

export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown): z.infer<typeof this.schema> {
    return this.schema.parse(value);
  }
}
