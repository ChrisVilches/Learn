import { type SolutionVerdict } from './solution'

export interface Problem {
  content: any
  tex: string
  debugInformation: string
}

interface ChoiceAnswer {
  label: string
  result: string
}

export interface ProblemSolutionOptions {
  freeInput: boolean
  choiceAnswers: ChoiceAnswer[]
}

export type ProblemGenerator = {
  fromDifficulty: (difficulty: number) => Problem | Promise<Problem>
  checkSolution: (givenSolution: string, problemContent: any) => SolutionVerdict
  problemContentParser: { parse: (data: unknown) => any }
} & ProblemSolutionOptions
