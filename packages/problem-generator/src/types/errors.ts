export class ParseError extends Error {
  constructor (message?: string) {
    if (typeof message === 'string' && message.length !== 0) {
      super(message)
    } else {
      super('Cannot parse solution')
    }
  }
}
