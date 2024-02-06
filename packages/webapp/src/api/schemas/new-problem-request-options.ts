import { createZodDto } from 'nestjs-zod';
import { problemDifficultySchema } from '../../logic/schemas/problem-difficulty';
import { z } from 'zod';

const newProblemRequestOptionsSchema = z.object({
  difficulty: z.coerce.number().pipe(problemDifficultySchema),
});

export class NewProblemRequestOptionsDto extends createZodDto(
  newProblemRequestOptionsSchema,
) {}
