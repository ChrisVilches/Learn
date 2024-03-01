import { NotOp } from './unary-op'
import { BoolSymbol } from './bool-symbol'
import { AndOp, OrOp, XorOp } from './binary-op'

describe('integration', () => {
  test('nested tree', () => {
    const p = new BoolSymbol('p')
    const q = new BoolSymbol('q')
    const negP = new NotOp(p)
    const exp1 = new AndOp(negP, q)
    const exp2 = new OrOp(negP, q)
    const root = new XorOp(exp1, exp2)

    expect(exp1.compute({ p: true, q: true })).toBe(false)
    expect(exp1.compute({ p: true, q: false })).toBe(false)
    expect(exp1.compute({ p: false, q: true })).toBe(true)
    expect(exp1.compute({ p: false, q: false })).toBe(false)

    expect(exp2.compute({ p: true, q: true })).toBe(true)
    expect(exp2.compute({ p: true, q: false })).toBe(false)
    expect(exp2.compute({ p: false, q: true })).toBe(true)
    expect(exp2.compute({ p: false, q: false })).toBe(true)

    expect(root.compute({ p: true, q: true })).toBe(true)
    expect(root.compute({ p: true, q: false })).toBe(false)
    expect(root.compute({ p: false, q: true })).toBe(false)
    expect(root.compute({ p: false, q: false })).toBe(true)
  })

  test('formatting', () => {
    const p = new BoolSymbol('p')
    const q = new BoolSymbol('q')
    const negP = new NotOp(p)
    const exp = new AndOp(negP, q)
    expect(p.toTex()).toBe('p')
    expect(q.toTex()).toBe('q')
    expect(negP.toTex()).toBe('\\neg p')
    expect(exp.toTex()).toBe('\\neg p \\land q')
  })

  test('formatting nested (binary)', () => {
    const p = new BoolSymbol('p')
    const q = new BoolSymbol('q')
    const negP = new NotOp(p)
    const exp = new AndOp(negP, q)
    const root = new AndOp(p, exp)
    expect(root.toTex()).toBe('p \\land (\\neg p \\land q)')
  })

  test('formatting nested (unary)', () => {
    const p = new BoolSymbol('p')
    const q = new BoolSymbol('q')
    const negP = new NotOp(p)
    const exp = new AndOp(negP, q)
    const root = new NotOp(exp)
    expect(root.toTex()).toBe('\\neg (\\neg p \\land q)')
  })

  test('formatting nested (binary and unary)', () => {
    const p = new BoolSymbol('p')
    const q = new BoolSymbol('q')
    const and = new AndOp(p, q)
    const negAnd = new NotOp(and)
    const root = new XorOp(p, negAnd)
    expect(root.toTex()).toBe('p \\oplus \\neg (p \\land q)')
  })
})
