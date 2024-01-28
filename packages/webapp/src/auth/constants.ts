import { z } from 'zod';

export const secretKey = z.string().parse(process.env.SECRET_KEY);
