import _ from 'lodash'

interface CreatePolynomialOptions {
  omitDegrees?: number[]
}

interface SumTerm {
  coef: number
  mult: string
}

function formatPolynomialX (degree: number): string {
  if (degree === 0) return ''
  if (degree === 1) return 'x'
  return `x^${degree}`
}

export function randomPolynomialTerms (degree: number, { omitDegrees }: CreatePolynomialOptions = {}): SumTerm[] {
  const omitDegreesSet = new Set(omitDegrees)

  return _.shuffle(_.range(degree + 1).map(degree => ({
    coef: omitDegreesSet.has(degree) ? 0 : _.random(-5, 5),
    mult: formatPolynomialX(degree)
  })))
}

function formatTerm ({ mult, coef }: SumTerm): string {
  if (coef === 0) return ''
  if (mult === '') return String(coef)
  if (coef === 1) return mult
  if (coef === -1) return `-${mult}`
  return `${coef} * ${mult}`
}

function formatGroupParenthesis (terms: SumTerm[]): string {
  const fmt = terms.map(formatTerm)
  const compact = fmt.filter(s => s.length > 0)
  if (compact.length === 0) return '0'
  if (compact.length === 1) return compact[0]
  return `(${formatSumTermsAux(terms)})`
}

function formatSumTermsAux (terms: SumTerm[]): string {
  const result = terms.map(formatTerm)
    .filter(t => t.length > 0)
    .join(' + ')
    .replace(/\+ -/g, '- ')

  return result.length > 0 ? result : '0'
}

export function formatSumTerms (terms: SumTerm[], { parenthesis } = { parenthesis: false }): string {
  if (parenthesis) {
    return formatGroupParenthesis(terms)
  } else {
    return formatSumTermsAux(terms)
  }
}

export function createPolynomial (degree: number, opts?: CreatePolynomialOptions): string {
  return formatSumTerms(randomPolynomialTerms(degree, opts))
}
