import { z } from 'zod';

// TODO: Add valid characters (for example disallow weird symbols, etc.)
// TODO: This will probably have to be moved to the persistence layer in the future? Since the DB has to validate this as well.
export const categorySlugSchema = z.string().min(2);
export type CategorySlug = z.infer<typeof categorySlugSchema>;
