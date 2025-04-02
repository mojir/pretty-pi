import { describe, expect, test } from 'vitest'
import { printSymbolically } from '../src'

/**
 * Test the symbolic printer with various test cases
 */
describe('testSymbolicPrinter', () => {
  test('basic constants', () => {
    expect(printSymbolically(Math.PI)).toBe('π')
    expect(printSymbolically(Math.E)).toBe('e')
    expect(printSymbolically((1 + Math.sqrt(5)) / 2)).toBe('φ') // Golden ratio
  })

  test('fractions', () => {
    expect(printSymbolically(0.5)).toBe('1/2')
    expect(printSymbolically(-0.5)).toBe('-1/2')
    expect(printSymbolically(0.25)).toBe('1/4')
    expect(printSymbolically(0.75)).toBe('3/4')
    expect(printSymbolically(0.2)).toBe('1/5')
    expect(printSymbolically(0.6666666666666666)).toBe('2/3')
    expect(printSymbolically(0.3333333333333333)).toBe('1/3')
    expect(printSymbolically(0.8333333333333334)).toBe('5/6')
    expect(printSymbolically(1.5)).toBe('3/2')
  })

  test('square roots', () => {
    expect(printSymbolically(Math.sqrt(2))).toBe('√2')
    expect(printSymbolically(Math.sqrt(3))).toBe('√3')
    expect(printSymbolically(Math.sqrt(4))).toBe('2') // Simplifies to integer
    expect(printSymbolically(Math.sqrt(5))).toBe('√5')
    expect(printSymbolically(Math.sqrt(7))).toBe('√7')
    expect(printSymbolically(Math.sqrt(9))).toBe('3') // Simplifies to integer
    expect(printSymbolically(Math.sqrt(10))).toBe('√10')
    expect(printSymbolically(Math.sqrt(16))).toBe('4') // Simplifies to integer
    expect(printSymbolically(Math.sqrt(25))).toBe('5') // Simplifies to integer
    expect(printSymbolically(Math.sqrt(27))).toBe('3·√3')
    expect(printSymbolically(Math.sqrt(50))).toBe('5·√2') // Should be simplified to 5·√2
    expect(printSymbolically(Math.sqrt(75))).toBe('5·√3') // Should be simplified to 5·√3
    expect(printSymbolically(-Math.sqrt(2))).toBe('-√2')
  })

  test('cube roots', () => {
    expect(printSymbolically(Math.cbrt(8))).toBe('2') // Simplifies to integer
    expect(printSymbolically(Math.cbrt(27))).toBe('3') // Simplifies to integer
    expect(printSymbolically(Math.cbrt(125))).toBe('5') // Simplifies to integer
    expect(printSymbolically(Math.cbrt(2))).toBe('∛2')
    expect(printSymbolically(Math.cbrt(3))).toBe('∛3')
  })

  test('multiples of constants', () => {
    expect(printSymbolically(2 * Math.PI)).toBe('2·π')
    expect(printSymbolically(3 * Math.E)).toBe('3·e')
    expect(printSymbolically(-Math.PI)).toBe('-π')
    expect(printSymbolically(-2 * Math.PI)).toBe('-2·π')
    expect(printSymbolically(2 * Math.sqrt(2))).toBe('2·√2')
    expect(printSymbolically(3 * Math.sqrt(3))).toBe('3·√3')
  })

  test('divisions with constants', () => {
    expect(printSymbolically(Math.PI / 2)).toBe('π/2')
    expect(printSymbolically(Math.PI / 3)).toBe('π/3')
    expect(printSymbolically(Math.PI / 4)).toBe('π/4')
    expect(printSymbolically(Math.PI / 6)).toBe('π/6')
    expect(printSymbolically(Math.E / 2)).toBe('e/2')
    expect(printSymbolically(Math.sqrt(2) / 2)).toBe('√2/2')
    expect(printSymbolically(Math.sqrt(3) / 2)).toBe('√3/2')
    expect(printSymbolically(Math.sqrt(3) / 3)).toBe('1/√3')
  })

  test('trigonometric values', () => {
    expect(printSymbolically(Math.sin(Math.PI / 6))).toBe('1/2') // sin(π/6) = 1/2
    expect(printSymbolically(Math.sin(Math.PI / 4))).toBe('√2/2') // sin(π/4) = √2/2
    expect(printSymbolically(Math.sin(Math.PI / 3))).toBe('√3/2') // sin(π/3) = √3/2
    expect(printSymbolically(Math.sin(Math.PI / 2))).toBe('1') // sin(π/2) = 1
    expect(printSymbolically(Math.cos(0))).toBe('1') // cos(0) = 1
    expect(printSymbolically(Math.cos(Math.PI / 6))).toBe('√3/2') // cos(π/6) = √3/2
    expect(printSymbolically(Math.cos(Math.PI / 4))).toBe('√2/2') // cos(π/4) = √2/2
    expect(printSymbolically(Math.cos(Math.PI / 3))).toBe('1/2') // cos(π/3) = 1/2
    expect(printSymbolically(Math.cos(Math.PI / 2))).toBe('0') // cos(π/2) = 0
    expect(printSymbolically(Math.tan(Math.PI / 6))).toBe('1/√3') // tan(π/6) = 1/√3
    expect(printSymbolically(Math.tan(Math.PI / 4))).toBe('1') // tan(π/4) = 1
    expect(printSymbolically(Math.tan(Math.PI / 3))).toBe('√3') // tan(π/3) = √3
  })

  test('complex expressions', () => {
    expect(printSymbolically(2 * Math.PI + 1)).toBe('2·π+1')
    expect(printSymbolically(Math.PI - 1)).toBe('π-1')
    expect(printSymbolically(2 * Math.PI - 3)).toBe('2·π-3')
    expect(printSymbolically(Math.sqrt(2) + Math.sqrt(3))).toBe('√2+√3')
    expect(printSymbolically(Math.sqrt(2) - Math.sqrt(3))).toBe('√2-√3')
    expect(printSymbolically(2 * Math.sqrt(2) + 3 * Math.sqrt(3))).toBe('2·√2+3·√3')
  })

  test('powers', () => {
    expect(printSymbolically(Math.PI ** 2)).toBe('π²')
    expect(printSymbolically(Math.E ** 2)).toBe('e²')
    expect(printSymbolically(2 ** 2)).toBe('4') // Simplifies to 4
    expect(printSymbolically(Math.sqrt(2) ** 2)).toBe('2') // Simplifies to 2
    expect(printSymbolically(Math.sqrt(3) ** 2)).toBe('3') // Simplifies to 3
  })

  test('complex simplifications', () => {
    expect(printSymbolically(12 * Math.cos(Math.PI / 6))).toBe('6·√3') // 12·cos(π/6) = 12·√3/2 = 6·√3
    expect(printSymbolically(4 * Math.sin(Math.PI / 4))).toBe('2·√2') // 4·sin(π/4) = 4·√2/2 = 2·√2
    expect(printSymbolically(6 * Math.sin(Math.PI / 3))).toBe('3·√3') // 6·sin(π/3) = 6·√3/2 = 3·√3
    expect(printSymbolically(6 * Math.sqrt(3) / 6)).toBe('√3') // Should simplify to √3
    expect(printSymbolically(Math.sqrt(2) * Math.sqrt(3))).toBe('√6') // Should multiply under the radical
    expect(printSymbolically(Math.sqrt(2) * Math.sqrt(8))).toBe('4') // Should simplify to 4
    expect(printSymbolically(1 + Math.sqrt(2) + Math.sqrt(2))).toBe('1+2·√2') // Should combine like terms
    expect(printSymbolically(Math.PI / 2 + Math.PI / 2)).toBe('π') // Should simplify to π
    expect(printSymbolically(Math.sqrt(2) / 2 * 2)).toBe('√2') // Should simplify the 2/2
  })

  test('rounding behavior', () => {
    expect(printSymbolically(0.0000000001)).toBe('0') // Very small number should round to 0
    expect(printSymbolically(0.9999999999)).toBe('1') // Number very close to 1 should round to 1
    expect(printSymbolically(-0.0000000001)).toBe('0') // Very small negative number should round to 0
    expect(printSymbolically(-0.9999999999)).toBe('-1') // Number very close to -1 should round to -1
  })

  test('logarithmic values', () => {
    expect(printSymbolically(Math.log(Math.E))).toBe('1') // ln(e) = 1
    expect(printSymbolically(Math.log(1))).toBe('0') // ln(1) = 0
    expect(printSymbolically(Math.log(Math.E ** 2))).toBe('2') // ln(e²) = 2
    expect(printSymbolically(Math.log(10) / Math.log(10))).toBe('1') // log₁₀(10) = 1
    expect(printSymbolically(Math.log(100) / Math.log(10))).toBe('2') // log₁₀(100) = 2
  })

  test('exponential values', () => {
    expect(printSymbolically(Math.exp(1))).toBe('e') // e¹ = e
    expect(printSymbolically(Math.exp(2))).toBe('e²') // e²
    expect(printSymbolically(Math.exp(0))).toBe('1') // e⁰ = 1
    expect(printSymbolically(Math.exp(-1))).toBe('1/e') // e⁻¹ = 1/e
  })

  test('negative powers', () => {
    expect(printSymbolically(Math.PI ** -1)).toBe('1/π') // π⁻¹ = 1/π
    expect(printSymbolically(Math.E ** -2)).toBe('1/e²') // e⁻² = 1/e²
    expect(printSymbolically(2 ** -3)).toBe('1/8') // 2⁻³ = 1/8
    expect(printSymbolically(Math.sqrt(2) ** -2)).toBe('1/2') // (√2)⁻² = 1/2
  })

  test('higher roots', () => {
    expect(printSymbolically(Math.pow(16, 1 / 4))).toBe('2') // ⁴√16 = 2
    expect(printSymbolically(Math.pow(32, 1 / 5))).toBe('2') // ⁵√32 = 2
    expect(printSymbolically(Math.pow(81, 1 / 4))).toBe('3') // ⁴√81 = 3
    expect(printSymbolically(Math.pow(243, 1 / 5))).toBe('3') // ⁵√243 = 3
  })

  test('large numbers', () => {
    expect(printSymbolically(1e6)).toBe('1000000') // 1 million
    expect(printSymbolically(1e-6)).toBe('0.000001') // 1 micro
    expect(printSymbolically(1e12)).toBe('1000000000000') // 1 trillion
    expect(printSymbolically(1e-12)).toBe('0.000000000001') // 1 pico
  })

  test('irrational approximations', () => {
    expect(printSymbolically(Number(Math.PI.toFixed(5)))).toBe('3.14159') // Approximation of π
    expect(printSymbolically(Number(Math.E.toFixed(5)))).toBe('2.71828') // Approximation of e
    expect(printSymbolically(Number(Math.sqrt(2).toFixed(5)))).toBe('1.41421') // Approximation of √2
    expect(printSymbolically(Number(Math.sqrt(3).toFixed(5)))).toBe('1.73205') // Approximation of √3
  })

  test('edge cases', () => {
    expect(printSymbolically(0)).toBe('0') // Zero
    expect(printSymbolically(-0)).toBe('0') // Negative zero
    expect(printSymbolically(Infinity)).toBe('∞') // Positive infinity
    expect(printSymbolically(-Infinity)).toBe('-∞') // Negative infinity
    expect(printSymbolically(NaN)).toBe('NaN') // Not a number
  })
})