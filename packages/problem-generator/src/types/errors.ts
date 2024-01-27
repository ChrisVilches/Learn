// TODO: This exception is used in many places. However, the errors aren't necessary
//       due to failing to parse a "solution". The functions in misc should be
//       domain agnostic, so they shouldn't think there's a "solution" involved.
//       Change name. UPDATE: I think a generic "cannot parse/evaluate/process numeric computation"
//       would be nice.
export class SolutionParseError extends Error {
  constructor (message?: string) {
    if (typeof message === 'string' && message.length !== 0) {
      super(message)
    } else {
      super('Cannot parse solution')
    }
  }
}
