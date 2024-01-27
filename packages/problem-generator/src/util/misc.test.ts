import { complex, parse } from 'mathjs'
import { camelToKebab, equalClose, objectKebabKeys, multipleEvalEqual } from './misc'

test(equalClose.name, () => {
  expect(equalClose(3, 4)).toBe(false)
  expect(equalClose(3, 3.0001)).toBe(false)
  expect(equalClose(3, 3.000000001)).toBe(true)
  expect(equalClose(complex('1 + i'), complex('1 + 1.1i'))).toBe(false)
  expect(equalClose(complex('1 + i'), complex('1 + 1.0000001i'))).toBe(true)
  expect(equalClose(complex('1 + 0.00000001i'), complex(1))).toBe(true)
  expect(equalClose(-Infinity, -Infinity)).toBe(true)
  expect(equalClose(-Infinity, Infinity)).toBe(false)
  expect(equalClose(Infinity, -Infinity)).toBe(false)
  expect(equalClose(Infinity, Infinity)).toBe(true)
  expect(equalClose(NaN, NaN)).toBe(true)
  expect(equalClose(NaN, Infinity)).toBe(false)
  expect(equalClose(NaN, -Infinity)).toBe(false)
  expect(equalClose(Infinity, NaN)).toBe(false)
  expect(equalClose(NaN, 4)).toBe(false)
  expect(equalClose(5, NaN)).toBe(false)
  expect(equalClose({ re: Infinity, im: 0 }, Infinity)).toBe(true)
  expect(equalClose({ re: Infinity, im: 0 }, { re: 0, im: -Infinity })).toBe(false)
  expect(equalClose({ re: -Infinity, im: 0 }, -Infinity)).toBe(true)
  expect(equalClose({ re: NaN, im: 0 }, NaN)).toBe(true)
  expect(equalClose({ re: NaN, im: NaN }, NaN)).toBe(false)
  expect(equalClose({ re: 0, im: NaN }, { re: 0, im: NaN })).toBe(true)
})

test(multipleEvalEqual.name, () => {
  expect(multipleEvalEqual(parse('x^2'), parse('x * x'))).toBe(true)
  expect(multipleEvalEqual(parse('x^2'), parse('x + x'))).toBe(false)
  expect(multipleEvalEqual(parse('sqrt(x)'), parse('x^0.5'))).toBe(true)
  expect(multipleEvalEqual(parse('sqrt(x) + a'), parse('x^0.5 + a'), { a: 5 })).toBe(true)
  expect(multipleEvalEqual(parse('sqrt(x)'), parse('x^0.25'))).toBe(false)
  expect(multipleEvalEqual(parse('log(x) + 2x + 5'), parse('7 - 1 + (log(x)/2) + (log(x)/2) + x + x'))).toBe(false)
  expect(multipleEvalEqual(parse('log(x) + 2x + 5'), parse('-2 + x + log(x) + x + 7'))).toBe(true)
  expect(multipleEvalEqual(parse('x'), parse('abs(x)'), {}, [0, 2, 3, 4, 5])).toBe(true)
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
