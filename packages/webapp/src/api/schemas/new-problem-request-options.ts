import { problemDifficultySchema } from '../../logic/schemas/problem-difficulty';
import { z } from 'zod';

export const newProblemRequestOptionsSchema = z.object({
  difficulty: z.coerce.number().pipe(problemDifficultySchema),
});

export type NewProblemRequestOptions = z.infer<
  typeof newProblemRequestOptionsSchema
>;
