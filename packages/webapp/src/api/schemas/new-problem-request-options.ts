import { z } from 'zod';

export const newProblemRequestOptionsSchema = z.object({
  difficulty: z.coerce.number().int().positive().max(100).default(10),
});

export type NewProblemRequestOptions = z.infer<
  typeof newProblemRequestOptionsSchema
>;
