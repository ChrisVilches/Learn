import { z } from 'zod';

export const problemSolutionSchema = z.object({
  problemId: z.coerce.number().int().positive(),
  solution: z.string(),
});

export type ProblemSolution = z.infer<typeof problemSolutionSchema>;
