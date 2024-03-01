import { BoolSymbol } from './bool-symbol'

describe(BoolSymbol.name, () => {
  test('compute correctly', () => {
    expect((new BoolSymbol('p')).compute({ p: true })).toBe(true)
    expect((new BoolSymbol('p')).compute({ p: false })).toBe(false)
  })

  test('error', () => {
    expect(() => (new BoolSymbol('p')).compute({ P: true })).toThrow()
  })
})
