import { type BoolNode } from './bool-node'

abstract class BinaryOp implements BoolNode {
  constructor (
    protected readonly left: BoolNode,
    protected readonly right: BoolNode
  ) {}

  formatGroupParenthesis (): boolean {
    return true
  }

  abstract compute (values: Record<string, boolean>): boolean
  abstract toTex (): string
  protected format (op: string): string {
    const left = this.left.formatGroupParenthesis() ? `(${this.left.toTex()})` : this.left.toTex()
    const right = this.right.formatGroupParenthesis() ? `(${this.right.toTex()})` : this.right.toTex()
    return `${left} ${op} ${right}`
  }
}

export class AndOp extends BinaryOp {
  toTex (): string {
    return this.format('\\land')
  }

  compute (values: Record<string, boolean>): boolean {
    return this.left.compute(values) && this.right.compute(values)
  }
}

export class OrOp extends BinaryOp {
  toTex (): string {
    return this.format('\\lor')
  }

  compute (values: Record<string, boolean>): boolean {
    return this.left.compute(values) || this.right.compute(values)
  }
}

export class XorOp extends BinaryOp {
  toTex (): string {
    return this.format('\\oplus')
  }

  compute (values: Record<string, boolean>): boolean {
    const a = this.left.compute(values)
    const b = this.right.compute(values)
    return (a && !b) || (!a && b)
  }
}

export class IffOp extends BinaryOp {
  toTex (): string {
    return this.format('\\iff')
  }

  compute (values: Record<string, boolean>): boolean {
    return this.left.compute(values) === this.right.compute(values)
  }
}

export class ImplyOp extends BinaryOp {
  toTex (): string {
    return this.format('\\implies')
  }

  compute (values: Record<string, boolean>): boolean {
    return !this.left.compute(values) || this.right.compute(values)
  }
}
