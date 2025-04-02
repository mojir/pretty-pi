import { describe, expect, test } from 'vitest'
import { toContinuedFraction, fromContinuedFraction, getConvergents, identifyQuadraticIrrational } from '../src/utils/continuedFractions'
import { printSymbolically } from '../src'

describe('continuedFractions', () => {
  test('toContinuedFraction converts numbers to continued fraction form', () => {
    expect(toContinuedFraction(Math.PI, 5)).toEqual([3, 7, 15, 1, 292]);
    expect(toContinuedFraction(Math.E, 5)).toEqual([2, 1, 2, 1, 1]);
    expect(toContinuedFraction(Math.sqrt(2), 5)).toEqual([1, 2, 2, 2, 2]);
    expect(toContinuedFraction(1.75, 5)).toEqual([1, 1, 3]);
  })

  test('fromContinuedFraction converts continued fractions to number fractions', () => {
    expect(fromContinuedFraction([1, 2, 2, 2])).toEqual([17, 12]); // Approximation of √2
    expect(fromContinuedFraction([3, 7, 15, 1])).toEqual([355, 113]); // Approximation of π
    expect(fromContinuedFraction([0, 1, 2])).toEqual([2, 3]); // 2/3
    expect(fromContinuedFraction([0, 2, 2])).toEqual([2, 5]); // 2/5
    expect(fromContinuedFraction([1, 1, 3])).toEqual([7, 4]); // 7/4 = 1.75
  })

  test('getConvergents returns all convergents of a continued fraction', () => {
    const convergents = getConvergents([3, 7, 15, 1, 292]);
    expect(convergents).toEqual([
      [3, 1],     // 3
      [22, 7],    // 3 + 1/7
      [333, 106], // 3 + 1/(7 + 1/15)
      [355, 113], // 3 + 1/(7 + 1/(15 + 1))
      [103993, 33102] // 3 + 1/(7 + 1/(15 + 1/(1 + 1/292)))
    ]);
  })

  test('complex fractions identified correctly with continued fractions', () => {
    // Test with some complex but "nice" fractions
    expect(printSymbolically(355 / 113)).toBe('355/113'); // A good approximation of π
    expect(printSymbolically(22 / 7)).toBe('22/7'); // Another approximation of π
    expect(printSymbolically(1.618033988749895)).toBe('φ'); // Golden ratio
    expect(printSymbolically(89 / 55)).toBe('89/55'); // Approximation of golden ratio
  })

  test('quadratic irrationals identified correctly', () => {
    // This test will depend on how advanced your identifyQuadraticIrrational function is
    if (identifyQuadraticIrrational) {
      // Basic test - if function exists, it should recognize √2
      const result = identifyQuadraticIrrational(Math.sqrt(2));
      expect(result).toBe('√2');

      // More advanced test - recognizes forms like (√5-1)/2
      const phi = (Math.sqrt(5) - 1) / 2; // The golden ratio conjugate
      expect(identifyQuadraticIrrational(phi)).toBe('(√5-1)/2');
    } else {
      // Skip test if function not implemented yet
      console.log('identifyQuadraticIrrational not implemented yet');
    }
  })

  test('continued fraction approach finds better fractions', () => {
    // Test with fractions that would be hard to find with a fixed denominator approach

    // 355/113 is an excellent approximation of π 
    // (needs denominators up to 113 to find)
    const piApprox = 355 / 113; // approximately 3.1415929...
    expect(printSymbolically(piApprox)).toBe('355/113');

    // 1393/1001 is hard to find with sequential checking
    const complexFraction = 1393 / 1001; // approximately 1.3916084...
    expect(printSymbolically(complexFraction)).toBe('1393/1001');

    // Check that it can handle "nicer" representations of complex fractions
    expect(printSymbolically(833 / 32)).toBe('833/32');
  })
})