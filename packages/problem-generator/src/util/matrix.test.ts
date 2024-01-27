import { rowLinearCombination } from './matrix'

describe(rowLinearCombination.name, () => {
  const matrix = [
    [1, 2, 3],
    [2, 3, 4],
    [-1, -2, 5]
  ]

  test('linear combination', () => {
    expect(rowLinearCombination(matrix, 0, 1, -1)).toStrictEqual([-1, -1, -1])
    expect(rowLinearCombination(matrix, 0, 1, 2)).toStrictEqual([5, 8, 11])
    expect(rowLinearCombination(matrix, 1, 2, -1)).toStrictEqual([3, 5, -1])
  })
})
