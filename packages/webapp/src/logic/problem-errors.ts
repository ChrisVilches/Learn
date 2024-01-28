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

export class SolutionCannotBeProcessed extends Error {
  constructor() {
    super('Solution cannot be processed');
  }
}
