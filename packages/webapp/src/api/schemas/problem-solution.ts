import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const problemSolutionSchema = z.object({
  problemId: z.coerce.number().int().positive(),
  solution: z.string(),
});

export class ProblemSolutionDto extends createZodDto(problemSolutionSchema) {}
