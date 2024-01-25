import { type SolutionVerdict } from './solution'

export interface Problem {
  content: any
  tex: string
  debugInformation: string
}

export interface ProblemGenerator {
  fromDifficulty: (difficulty: number) => Problem | Promise<Problem>
  checkSolution: (givenSolution: string, problemContent: any) => SolutionVerdict
  problemContentParser: { parse: (data: unknown) => any }
}
