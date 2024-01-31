import { z } from 'zod';
import { problemDifficultySchema } from './problem-difficulty';

export const categoryPreferencesConfigSchema = z
  .object({
    difficulty: problemDifficultySchema.optional(),
  })
  .strict();

export type CategoryPreferencesConfig = z.infer<
  typeof categoryPreferencesConfigSchema
>;
