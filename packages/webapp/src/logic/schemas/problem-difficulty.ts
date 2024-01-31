import { z } from 'zod';

export const problemDifficultySchema = z.number().int().positive().max(100);
