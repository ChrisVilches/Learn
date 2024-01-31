import { z } from 'zod'
import { httpClientAuth } from './http-client-auth'

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  slug: z.string()
})

const categoryPreferencesSchema = z.object({
  preferences: z.object({
    difficulty: z.number().min(1).max(100)
  })
})

const categoryWithPreferences = z.intersection(categorySchema, categoryPreferencesSchema)

type Category = z.infer<typeof categorySchema>
type CategoryWithPreferences = z.infer<typeof categoryWithPreferences>

const problemGeneratorSchema = z.object({
  id: z.number(),
  name: z.string(),
  enabled: z.boolean()
})

type ProblemGenerator = z.infer<typeof problemGeneratorSchema>

export async function fetchCategories (): Promise<Category[]> {
  const result = await httpClientAuth.get('/categories')

  return categorySchema.array().parse(result.data)
}

export async function fetchCategory (slug: string): Promise<CategoryWithPreferences> {
  const result = await httpClientAuth.get(`/category/${slug}`)

  return categoryWithPreferences.parse(result.data)
}

export async function fetchCategoryGenerators (categorySlug: string): Promise<ProblemGenerator[]> {
  const result = await httpClientAuth.get(`/category/${categorySlug}/enabled-generators`)

  return problemGeneratorSchema.array().parse(result.data)
}

export async function toggleEnabledProblemGenerator (id: number, enable: boolean): Promise<ProblemGenerator> {
  const result = await httpClientAuth.put(`toggle-generator/${id}`, { enable })

  return problemGeneratorSchema.parse(result.data)
}

export async function saveDifficultyPreference (difficulty: number, categorySlug: string): Promise<void> {
  const payload = { difficulty }
  await httpClientAuth.put(`/category/${categorySlug}/preferences`, payload)
}
