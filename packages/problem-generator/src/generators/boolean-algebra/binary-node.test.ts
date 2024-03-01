import { AndOp, IffOp, ImplyOp, OrOp, XorOp } from './binary-op'
import { BoolSymbol } from './bool-symbol'

describe(AndOp.name, () => {
  test('compute correctly', () => {
    const exp = new AndOp(new BoolSymbol('p'), new BoolSymbol('q'))
    expect(exp.compute({ p: true, q: true })).toBe(true)
    expect(exp.compute({ p: true, q: false })).toBe(false)
    expect(exp.compute({ p: false, q: true })).toBe(false)
    expect(exp.compute({ p: false, q: false })).toBe(false)
  })
})

describe(OrOp.name, () => {
  test('compute correctly', () => {
    const exp = new OrOp(new BoolSymbol('p'), new BoolSymbol('q'))
    expect(exp.compute({ p: true, q: true })).toBe(true)
    expect(exp.compute({ p: true, q: false })).toBe(true)
    expect(exp.compute({ p: false, q: true })).toBe(true)
    expect(exp.compute({ p: false, q: false })).toBe(false)
  })
})

describe(XorOp.name, () => {
  test('compute correctly', () => {
    const exp = new XorOp(new BoolSymbol('p'), new BoolSymbol('q'))
    expect(exp.compute({ p: true, q: true })).toBe(false)
    expect(exp.compute({ p: true, q: false })).toBe(true)
    expect(exp.compute({ p: false, q: true })).toBe(true)
    expect(exp.compute({ p: false, q: false })).toBe(false)
  })
})

describe(IffOp.name, () => {
  test('compute correctly', () => {
    const exp = new IffOp(new BoolSymbol('p'), new BoolSymbol('q'))
    expect(exp.compute({ p: true, q: true })).toBe(true)
    expect(exp.compute({ p: true, q: false })).toBe(false)
    expect(exp.compute({ p: false, q: true })).toBe(false)
    expect(exp.compute({ p: false, q: false })).toBe(true)
  })
})

describe(ImplyOp.name, () => {
  test('compute correctly', () => {
    const exp = new ImplyOp(new BoolSymbol('p'), new BoolSymbol('q'))
    expect(exp.compute({ p: true, q: true })).toBe(true)
    expect(exp.compute({ p: true, q: false })).toBe(false)
    expect(exp.compute({ p: false, q: true })).toBe(true)
    expect(exp.compute({ p: false, q: false })).toBe(true)
  })
})
