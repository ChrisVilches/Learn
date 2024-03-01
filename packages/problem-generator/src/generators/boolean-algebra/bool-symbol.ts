import { type BoolNode } from './bool-node'

export class BoolSymbol implements BoolNode {
  constructor (private readonly name: string) {}

  formatGroupParenthesis (): boolean {
    return false
  }

  toTex (): string {
    return this.name
  }

  compute (values: Record<string, boolean>): boolean {
    if (this.name in values) {
      return values[this.name]
    }

    throw new Error('Symbol cannot be evaluated')
  }
}
