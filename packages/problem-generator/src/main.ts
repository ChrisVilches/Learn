import { integration } from './generators/integration'
import { linearEquation } from './generators/linear-equation'
import { matrixBasic } from './generators/matrix-basic'
import { matrixInversion } from './generators/matrix-inversion'
import { matrixRank } from './generators/matrix-rank'
import { quadraticEquation } from './generators/quadratic-equation'
import { singleVariableDerivative } from './generators/single-variable-derivative'
import { SolutionParseError as _SolutionParseError } from './types/errors'
import { type ProblemSolutionOptions as _ProblemSolutionOptions } from './types/problem'
import { objectKebabKeys } from './util/misc'

// TODO: Is there a better way to re-export the imported value? I don't want this.
export const SolutionParseError = _SolutionParseError
export type ProblemSolutionOptions = _ProblemSolutionOptions

export const problemGenerators = objectKebabKeys({
  matrixRank,
  matrixBasic,
  matrixInversion,
  integration,
  quadraticEquation,
  linearEquation,
  singleVariableDerivative
})
