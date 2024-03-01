import { type BoolNode } from './bool-node'

abstract class UnaryOp implements BoolNode {
  constructor (
    protected readonly child: BoolNode
  ) {}

  formatGroupParenthesis (): boolean {
    return false
  }

  abstract compute (values: Record<string, boolean>): boolean
  abstract toTex (): string
}

export class NotOp extends UnaryOp {
  toTex (): string {
    const child = this.child.formatGroupParenthesis() ? `(${this.child.toTex()})` : this.child.toTex()
    return `\\neg ${child}`
  }

  compute (values: Record<string, boolean>): boolean {
    return !this.child.compute(values)
  }
}
