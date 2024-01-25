// TODO: Consider removing the 'cannot-parse' verdict, since I just throw
//       exceptions from the misc functions that parse things.
// TODO: Add parse timeout error.
type SolutionError = 'cannot-parse' | 'incorrect'

export type SolutionVerdict = 'ok' | SolutionError
