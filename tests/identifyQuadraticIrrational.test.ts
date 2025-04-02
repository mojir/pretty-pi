import { describe, expect, test } from 'vitest'
import { identifyQuadraticIrrational, toContinuedFraction } from '../src/utils/continuedFractions'

describe('identifyQuadraticIrrational', () => {
  // Test square roots of integers
  test('identifies square roots of integers', () => {
    expect(identifyQuadraticIrrational(Math.sqrt(2))).toBe('√2')
    expect(identifyQuadraticIrrational(Math.sqrt(3))).toBe('√3')
    expect(identifyQuadraticIrrational(Math.sqrt(5))).toBe('√5')
    expect(identifyQuadraticIrrational(Math.sqrt(7))).toBe('√7')
    expect(identifyQuadraticIrrational(Math.sqrt(10))).toBe('√10')
    expect(identifyQuadraticIrrational(Math.sqrt(11))).toBe('√11')
    expect(identifyQuadraticIrrational(Math.sqrt(13))).toBe('√13')
  })

  // Test the golden ratio and its conjugate
  test('identifies golden ratio and its conjugate', () => {
    const phi = (1 + Math.sqrt(5)) / 2
    const phiConjugate = (Math.sqrt(5) - 1) / 2

    expect(identifyQuadraticIrrational(phi)).toBe('φ')
    expect(identifyQuadraticIrrational(phiConjugate)).toBe('(√5-1)/2')
  })

  // Test expressions of the form (√n ± m)/k
  test('identifies expressions of form (√n ± m)/k', () => {
    expect(identifyQuadraticIrrational((Math.sqrt(2) + 1) / 2)).toBe('(√2+1)/2')
    expect(identifyQuadraticIrrational((Math.sqrt(3) - 1) / 2)).toBe('(√3-1)/2')
    expect(identifyQuadraticIrrational((Math.sqrt(7) + 2) / 3)).toBe('(√7+2)/3')
    expect(identifyQuadraticIrrational((Math.sqrt(13) - 3) / 2)).toBe('(√13-3)/2')
  })

  // Test more complex values with known continued fraction patterns
  test('identifies quadratic irrationals from continued fraction patterns', () => {
    // √8 = 2√2 has CF [2; 1, 4, 1, 4, ...]
    expect(identifyQuadraticIrrational(Math.sqrt(8))).toBe('√8')

    // √12 = 2√3 has CF [3; 2, 6, 2, 6, ...]
    expect(identifyQuadraticIrrational(Math.sqrt(12))).toBe('√12')

    // √18 = 3√2 has CF [4; 4, 8, 4, 8, ...]
    expect(identifyQuadraticIrrational(Math.sqrt(18))).toBe('√18')
  })

  // Test negative cases (non-quadratic irrationals)
  test('returns null for non-quadratic irrationals', () => {
    // π is not a quadratic irrational
    expect(identifyQuadraticIrrational(Math.PI)).toBeNull()

    // e is not a quadratic irrational
    expect(identifyQuadraticIrrational(Math.E)).toBeNull()

    // ln(2) is not a quadratic irrational
    expect(identifyQuadraticIrrational(Math.LN2)).toBeNull()

    // A random decimal number
    expect(identifyQuadraticIrrational(0.123456789)).toBeNull()
  })

  // Test that slight approximations still work
  test('works with small approximation errors', () => {
    // Slightly off value of √2
    const almostSqrt2 = 1.4142135623730952
    expect(identifyQuadraticIrrational(almostSqrt2)).toBe('√2')

    // Slightly off value of the golden ratio
    const almostPhi = 1.6180339887498947
    expect(identifyQuadraticIrrational(almostPhi)).toBe('φ')
  })

  // Test that continued fraction patterns are correctly detected
  test('detects periodic patterns in continued fractions', () => {
    // Test that √2 has the correct continued fraction [1; 2, 2, 2, ...]
    const cfSqrt2 = toContinuedFraction(Math.sqrt(2), 10)
    expect(cfSqrt2[0]).toBe(1)
    expect(cfSqrt2.slice(1).every(term => term === 2 || Math.abs(term - 2) < 1e-10)).toBeTruthy()

    // Test that the golden ratio has the correct continued fraction [1; 1, 1, 1, ...]
    const cfPhi = toContinuedFraction((1 + Math.sqrt(5)) / 2, 10)
    expect(cfPhi[0]).toBe(1)
    expect(cfPhi.slice(1).every(term => term === 1 || Math.abs(term - 1) < 1e-10)).toBeTruthy()
  })
})