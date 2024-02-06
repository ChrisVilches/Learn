import { z } from 'zod';
import { problemDifficultySchema } from './problem-difficulty';
import { createZodDto } from 'nestjs-zod';

export const categoryPreferencesConfigSchema = z
  .object({
    difficulty: problemDifficultySchema.optional(),
  })
  .strict();

export class CategoryPreferencesConfigDto extends createZodDto(
  categoryPreferencesConfigSchema,
) {}
