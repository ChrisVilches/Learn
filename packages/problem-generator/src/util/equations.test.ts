import { parse } from 'mathjs'
import { bisection, isFunctionLinear, parabolaHasRepeatedSolutions } from './equations'

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

test(isFunctionLinear.name, () => {
  expect(isFunctionLinear((x: number) => x + 3)).toBe(true)
  expect(isFunctionLinear((x: number) => x * x)).toBe(false)
  expect(isFunctionLinear((x: number) => 100 * x * x)).toBe(false)
  expect(isFunctionLinear((x: number) => x * x / 100)).toBe(false)
  expect(isFunctionLinear((x: number) => (x * x / 100) + 5)).toBe(false)
  expect(isFunctionLinear((x: number) => Math.pow(x, 3))).toBe(false)
  expect(isFunctionLinear((_x: number) => 1)).toBe(true)
  expect(isFunctionLinear((_x: number) => 0)).toBe(true)
})
