export class ForbiddenSolveProblem extends Error {
  constructor() {
    super('Not allowed to solve problem');
  }
}

export class ProblemAlreadyAttempted extends Error {
  constructor() {
    super('Problem was already attempted');
  }
}
