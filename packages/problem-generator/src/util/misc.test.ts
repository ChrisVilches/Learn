import { complex, parse } from 'mathjs'
import { camelToKebab, equalClose, objectKebabKeys, testMultipleValues } from './misc'

test(equalClose.name, () => {
  expect(equalClose(3, 4)).toBe(false)
  expect(equalClose(3, 3.0001)).toBe(false)
  expect(equalClose(3, 3.000000001)).toBe(true)
  expect(equalClose(complex('1 + i'), complex('1 + 1.1i'))).toBe(false)
  expect(equalClose(complex('1 + i'), complex('1 + 1.0000001i'))).toBe(true)
})

test(testMultipleValues.name, () => {
  expect(testMultipleValues(parse('x^2'), parse('x * x'))).toBe(true)
  expect(testMultipleValues(parse('x^2'), parse('x + x'))).toBe(false)
  expect(testMultipleValues(parse('sqrt(x)'), parse('x^0.5'))).toBe(true)
  expect(testMultipleValues(parse('sqrt(x) + a'), parse('x^0.5 + a'), { a: 5 })).toBe(true)
  expect(testMultipleValues(parse('sqrt(x)'), parse('x^0.25'))).toBe(false)
  expect(testMultipleValues(parse('log(x) + 2x + 5'), parse('7 - 2 + log(x)/2 + log(x)/2 + x + x'))).toBe(true)
  expect(testMultipleValues(parse('x'), parse('abs(x)'), {}, [0, 2, 3, 4, 5])).toBe(true)
})

test(camelToKebab.name, () => {
  expect(camelToKebab('helloWorld')).toBe('hello-world')
  expect(camelToKebab('HELLO')).toBe('h-e-l-l-o')
  expect(camelToKebab('HelloWorld')).toBe('hello-world')
  expect(camelToKebab('byeHelloWorld')).toBe('bye-hello-world')
})

test(objectKebabKeys.name, () => {
  expect(objectKebabKeys({ helloWorld: 0, someKey: 1 })).toStrictEqual({ 'hello-world': 0, 'some-key': 1 })
  expect(objectKebabKeys({})).toStrictEqual({})
})
