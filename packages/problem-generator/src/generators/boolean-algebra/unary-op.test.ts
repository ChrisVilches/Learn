import { NotOp } from './unary-op'
import { BoolSymbol } from './bool-symbol'

describe(NotOp.name, () => {
  test('compute correctly', () => {
    const exp = new NotOp(new BoolSymbol('p'))
    expect(exp.compute({ p: true })).toBe(false)
    expect(exp.compute({ p: false })).toBe(true)
  })
})
