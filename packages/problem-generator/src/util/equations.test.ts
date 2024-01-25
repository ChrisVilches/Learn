import { parse } from 'mathjs'
import { bisection, parabolaHasRepeatedSolutions } from './equations'

test(bisection.name, () => {
  expect(bisection(parse('2x + 1'))).toBeCloseTo(-0.5)
  expect(bisection(parse('-2x + 1'))).toBeCloseTo(0.5)
  expect(bisection(parse('-x^3'))).toBeCloseTo(0)
  expect(bisection(parse('(x + 1)^3'))).toBeCloseTo(-1)
  expect(bisection(parse('(x - 10)^3'))).toBeCloseTo(10)
  expect(bisection(parse('exp(x-10) - 20'))).toBeCloseTo(12.996)
})

test(parabolaHasRepeatedSolutions.name, () => {
  expect(parabolaHasRepeatedSolutions(parse('x^2'))).toBe(true)
  expect(parabolaHasRepeatedSolutions(parse('x^2 - 1'))).toBe(false)
  expect(parabolaHasRepeatedSolutions(parse('x^2 + 1'))).toBe(false)
  expect(parabolaHasRepeatedSolutions(parse('(x - 10)^2'))).toBe(true)
  expect(parabolaHasRepeatedSolutions(parse('3(x - 10)^2'))).toBe(true)
})
