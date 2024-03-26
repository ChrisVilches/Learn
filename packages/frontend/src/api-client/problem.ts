import { z } from 'zod'
import { httpClientAuth } from './http-client-auth'

const problemSchema = z.object({
  id: z.number(),
  tex: z.string(),
  difficulty: z.number(),
  freeInput: z.boolean(),
  choiceAnswers: z.array(z.object({
    label: z.string(),
    result: z.string()
  })),
  freeInputHelp: z.string().default('')
})

export type Problem = z.infer<typeof problemSchema>

const problemVerdictSchema = z.object({
  verdict: z.literal('ok').or(z.literal('incorrect'))
})

const helpSchema = z.object({ help: z.string() })

type ProblemVerdict = z.infer<typeof problemVerdictSchema>

export async function generateNewProblem (categorySlug: string, difficulty: number): Promise<Problem> {
  const result = await httpClientAuth.get(`/new-problem/${categorySlug}`, {
    params: {
      difficulty
    }
  })

  return problemSchema.parse(result.data)
}

export async function judgeProblem (problemId: number, solution: string): Promise<ProblemVerdict> {
  const result = await httpClientAuth.post('/judge-problem', { problemId, solution })

  return problemVerdictSchema.parse(result.data)
}

export async function getProblemHelp (problemId: number): Promise<string> {
  const result = await httpClientAuth.get('/problem-help', {
    params: { id: problemId }
  })

  return helpSchema.parse(result.data).help
}
