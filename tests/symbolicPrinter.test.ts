import { describe, expect, test } from 'vitest'
import { prettyPi } from '../src'

/**
 * Test the symbolic printer with various test cases
 */
describe('testSymbolicPrinter', () => {
  test('non finite', () => {
    expect(prettyPi(1 / 0)).toBe('∞')
    expect(prettyPi(-1 / 0)).toBe('-∞')
    expect(prettyPi(Math.sqrt(-1))).toBe('NaN')
  })
  test('space separated output', () => {
    expect(prettyPi(345 / 456, { spaceSeparation: true })).toBe('115 / 152')
    expect(prettyPi(2 * Math.PI, { spaceSeparation: true })).toBe('2 · π')
    expect(prettyPi(3 * Math.E, { spaceSeparation: true })).toBe('3 · e')
    expect(prettyPi(-Math.PI, { spaceSeparation: true })).toBe('-(π)')
    expect(prettyPi(-2 * Math.PI, { spaceSeparation: true })).toBe('-(2 · π)')
    expect(prettyPi(2 * Math.sqrt(2), { spaceSeparation: true })).toBe('2 · √2')
    expect(prettyPi(3 * Math.sqrt(3), { spaceSeparation: true })).toBe('3 · √3')
    expect(prettyPi(2 * Math.PI + 1, { spaceSeparation: true })).toBe('2 · π + 1')
    expect(prettyPi(Math.PI - 1, { spaceSeparation: true })).toBe('π - 1')
    expect(prettyPi(2 * Math.PI - 3, { spaceSeparation: true })).toBe('2 · π - 3')
  })

  test('precision', () => {
    expect(prettyPi(0.1234567890123456789)).toBe('0.12345679') // Default precision of 8
    expect(prettyPi(0.1234567890123456789, { precision: 5 })).toBe('0.12346') // Precision of 5
    expect(prettyPi(0.1234567890123456789, { precision: 10 })).toBe('0.1234567890') // Precision of 10
  })

  test('basic constants', () => {
    expect(prettyPi(Math.PI)).toBe('π')
    expect(prettyPi(Math.E)).toBe('e')
    expect(prettyPi((1 + Math.sqrt(5)) / 2)).toBe('φ') // Golden ratio
  })

  test('fractions', () => {
    expect(prettyPi(0.5)).toBe('1/2')
    expect(prettyPi(-0.5)).toBe('-1/2')
    expect(prettyPi(0.25)).toBe('1/4')
    expect(prettyPi(0.75)).toBe('3/4')
    expect(prettyPi(0.2)).toBe('1/5')
    expect(prettyPi(0.6666666666666666)).toBe('2/3')
    expect(prettyPi(0.3333333333333333)).toBe('1/3')
    expect(prettyPi(0.8333333333333334)).toBe('5/6')
    expect(prettyPi(1.5)).toBe('3/2')
  })

  test('square roots', () => {
    expect(prettyPi(Math.sqrt(2))).toBe('√2')
    expect(prettyPi(Math.sqrt(3))).toBe('√3')
    expect(prettyPi(Math.sqrt(4))).toBe('2') // Simplifies to integer
    expect(prettyPi(Math.sqrt(5))).toBe('√5')
    expect(prettyPi(Math.sqrt(7))).toBe('√7')
    expect(prettyPi(Math.sqrt(9))).toBe('3') // Simplifies to integer
    expect(prettyPi(Math.sqrt(10))).toBe('√10')
    expect(prettyPi(Math.sqrt(16))).toBe('4') // Simplifies to integer
    expect(prettyPi(Math.sqrt(25))).toBe('5') // Simplifies to integer
    expect(prettyPi(Math.sqrt(27))).toBe('3·√3')
    expect(prettyPi(Math.sqrt(50))).toBe('5·√2') // Should be simplified to 5·√2
    expect(prettyPi(Math.sqrt(75))).toBe('5·√3') // Should be simplified to 5·√3
    expect(prettyPi(-Math.sqrt(2))).toBe('-√2')
  })

  test('cube roots', () => {
    expect(prettyPi(Math.cbrt(8))).toBe('2') // Simplifies to integer
    expect(prettyPi(Math.cbrt(27))).toBe('3') // Simplifies to integer
    expect(prettyPi(Math.cbrt(125))).toBe('5') // Simplifies to integer
    expect(prettyPi(Math.cbrt(2))).toBe('∛2')
    expect(prettyPi(Math.cbrt(3))).toBe('∛3')
  })

  test('multiples of constants', () => {
    expect(prettyPi(2 * Math.PI)).toBe('2·π')
    expect(prettyPi(3 * Math.E)).toBe('3·e')
    expect(prettyPi(-Math.PI)).toBe('-π')
    expect(prettyPi(-2 * Math.PI)).toBe('-2·π')
    expect(prettyPi(2 * Math.sqrt(2))).toBe('2·√2')
    expect(prettyPi(3 * Math.sqrt(3))).toBe('3·√3')
  })

  test('divisions with constants', () => {
    expect(prettyPi(Math.PI / 2)).toBe('π/2')
    expect(prettyPi(Math.PI / 3)).toBe('π/3')
    expect(prettyPi(Math.PI / 4)).toBe('π/4')
    expect(prettyPi(Math.PI / 6)).toBe('π/6')
    expect(prettyPi(Math.E / 2)).toBe('e/2')
    expect(prettyPi(Math.sqrt(2) / 2)).toBe('√2/2')
    expect(prettyPi(Math.sqrt(3) / 2)).toBe('√3/2')
    expect(prettyPi(Math.sqrt(3) / 3)).toBe('1/√3')
  })

  test('trigonometric values', () => {
    expect(prettyPi(Math.sin(Math.PI / 6))).toBe('1/2') // sin(π/6) = 1/2
    expect(prettyPi(Math.sin(Math.PI / 4))).toBe('√2/2') // sin(π/4) = √2/2
    expect(prettyPi(Math.sin(Math.PI / 3))).toBe('√3/2') // sin(π/3) = √3/2
    expect(prettyPi(Math.sin(Math.PI / 2))).toBe('1') // sin(π/2) = 1
    expect(prettyPi(Math.cos(0))).toBe('1') // cos(0) = 1
    expect(prettyPi(Math.cos(Math.PI / 6))).toBe('√3/2') // cos(π/6) = √3/2
    expect(prettyPi(Math.cos(Math.PI / 4))).toBe('√2/2') // cos(π/4) = √2/2
    expect(prettyPi(Math.cos(Math.PI / 3))).toBe('1/2') // cos(π/3) = 1/2
    expect(prettyPi(Math.cos(Math.PI / 2))).toBe('0') // cos(π/2) = 0
    expect(prettyPi(Math.tan(Math.PI / 6))).toBe('1/√3') // tan(π/6) = 1/√3
    expect(prettyPi(Math.tan(Math.PI / 4))).toBe('1') // tan(π/4) = 1
    expect(prettyPi(Math.tan(Math.PI / 3))).toBe('√3') // tan(π/3) = √3
  })

  test('complex expressions', () => {
    expect(prettyPi(2 * Math.PI + 1)).toBe('2·π+1')
    expect(prettyPi(Math.PI - 1)).toBe('π-1')
    expect(prettyPi(2 * Math.PI - 3)).toBe('2·π-3')
    expect(prettyPi(Math.sqrt(2) + Math.sqrt(3))).toBe('√2+√3')
    expect(prettyPi(Math.sqrt(2) - Math.sqrt(3))).toBe('√2-√3')
    expect(prettyPi(2 * Math.sqrt(2) + 3 * Math.sqrt(3))).toBe('2·√2+3·√3')
  })

  test('powers', () => {
    expect(prettyPi(Math.PI ** 2)).toBe('π²')
    expect(prettyPi(Math.E ** 2)).toBe('e²')
    expect(prettyPi(2 ** 2)).toBe('4') // Simplifies to 4
    expect(prettyPi(Math.sqrt(2) ** 2)).toBe('2') // Simplifies to 2
    expect(prettyPi(Math.sqrt(3) ** 2)).toBe('3') // Simplifies to 3
  })

  test('complex simplifications', () => {
    expect(prettyPi(12 * Math.cos(Math.PI / 6))).toBe('6·√3') // 12·cos(π/6) = 12·√3/2 = 6·√3
    expect(prettyPi(4 * Math.sin(Math.PI / 4))).toBe('2·√2') // 4·sin(π/4) = 4·√2/2 = 2·√2
    expect(prettyPi(6 * Math.sin(Math.PI / 3))).toBe('3·√3') // 6·sin(π/3) = 6·√3/2 = 3·√3
    expect(prettyPi(6 * Math.sqrt(3) / 6)).toBe('√3') // Should simplify to √3
    expect(prettyPi(Math.sqrt(2) * Math.sqrt(3))).toBe('√6') // Should multiply under the radical
    expect(prettyPi(Math.sqrt(2) * Math.sqrt(8))).toBe('4') // Should simplify to 4
    expect(prettyPi(1 + Math.sqrt(2) + Math.sqrt(2))).toBe('1+2·√2') // Should combine like terms
    expect(prettyPi(Math.PI / 2 + Math.PI / 2)).toBe('π') // Should simplify to π
    expect(prettyPi(Math.sqrt(2) / 2 * 2)).toBe('√2') // Should simplify the 2/2
  })

  test('rounding behavior', () => {
    expect(prettyPi(0.0000000001)).toBe('0') // Very small number should round to 0
    expect(prettyPi(0.9999999999)).toBe('1') // Number very close to 1 should round to 1
    expect(prettyPi(-0.0000000001)).toBe('0') // Very small negative number should round to 0
    expect(prettyPi(-0.9999999999)).toBe('-1') // Number very close to -1 should round to -1
  })

  test('logarithmic values', () => {
    expect(prettyPi(Math.log(Math.E))).toBe('1') // ln(e) = 1
    expect(prettyPi(Math.log(1))).toBe('0') // ln(1) = 0
    expect(prettyPi(Math.log(Math.E ** 2))).toBe('2') // ln(e²) = 2
    expect(prettyPi(Math.log(10) / Math.log(10))).toBe('1') // log₁₀(10) = 1
    expect(prettyPi(Math.log(100) / Math.log(10))).toBe('2') // log₁₀(100) = 2
  })

  test('exponential values', () => {
    expect(prettyPi(Math.exp(1))).toBe('e') // e¹ = e
    expect(prettyPi(Math.exp(2))).toBe('e²') // e²
    expect(prettyPi(Math.exp(0))).toBe('1') // e⁰ = 1
    expect(prettyPi(Math.exp(-1))).toBe('1/e') // e⁻¹ = 1/e
  })

  test('negative powers', () => {
    expect(prettyPi(Math.PI ** -1)).toBe('1/π') // π⁻¹ = 1/π
    expect(prettyPi(Math.E ** -2)).toBe('1/e²') // e⁻² = 1/e²
    expect(prettyPi(2 ** -3)).toBe('1/8') // 2⁻³ = 1/8
    expect(prettyPi(Math.sqrt(2) ** -2)).toBe('1/2') // (√2)⁻² = 1/2
  })

  test('higher roots', () => {
    expect(prettyPi(Math.pow(16, 1 / 4))).toBe('2') // ⁴√16 = 2
    expect(prettyPi(Math.pow(32, 1 / 5))).toBe('2') // ⁵√32 = 2
    expect(prettyPi(Math.pow(81, 1 / 4))).toBe('3') // ⁴√81 = 3
    expect(prettyPi(Math.pow(243, 1 / 5))).toBe('3') // ⁵√243 = 3
  })

  test('large numbers', () => {
    expect(prettyPi(1e6)).toBe('1000000') // 1 million
    expect(prettyPi(1e-6)).toBe('0.000001') // 1 micro
    expect(prettyPi(1e12)).toBe('1000000000000') // 1 trillion
    expect(prettyPi(1e-12)).toBe('0') // 1 pico
  })

  test('irrational approximations', () => {
    expect(prettyPi(Number(Math.PI.toFixed(5)))).toBe('3.14159') // Approximation of π
    expect(prettyPi(Number(Math.E.toFixed(5)))).toBe('2.71828') // Approximation of e
    expect(prettyPi(Number(Math.sqrt(2).toFixed(5)))).toBe('1.41421') // Approximation of √2
    expect(prettyPi(Number(Math.sqrt(3).toFixed(5)))).toBe('1.73205') // Approximation of √3
  })

  test('edge cases', () => {
    expect(prettyPi(0)).toBe('0') // Zero
    expect(prettyPi(-0)).toBe('0') // Negative zero
    expect(prettyPi(Infinity)).toBe('∞') // Positive infinity
    expect(prettyPi(-Infinity)).toBe('-∞') // Negative infinity
    expect(prettyPi(NaN)).toBe('NaN') // Not a number
  })
})