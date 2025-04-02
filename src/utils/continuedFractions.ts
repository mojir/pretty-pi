/**
 * Converts a number to its continued fraction representation
 * @param x The number to convert
 * @param maxTerms Maximum number of terms to compute
 * @returns Array of continued fraction terms [a0, a1, a2, ...]
 */
export function toContinuedFraction(x: number, maxTerms: number = 20): number[] {
  const terms: number[] = [];
  const EPSILON = 1e-10;

  for (let i = 0; i < maxTerms; i++) {
    const a = Math.floor(x);
    terms.push(a);

    // If we've reached a very small remainder, we're done
    if (Math.abs(x - a) < EPSILON) {
      break;
    }

    // Avoid division by zero
    if (Math.abs(x - a) < EPSILON) {
      break;
    }

    x = 1 / (x - a);
  }

  return terms;
}

/**
 * Converts continued fraction terms to a fraction [numerator, denominator]
 * @param terms Array of continued fraction terms
 * @returns [numerator, denominator]
 */
export function fromContinuedFraction(terms: number[]): [number, number] {
  if (terms.length === 0) return [0, 1];
  if (terms.length === 1) return [terms[0], 1];

  // Start with the last term
  let numerator = terms[terms.length - 1];
  let denominator = 1;

  // Work backwards through the terms
  for (let i = terms.length - 2; i >= 0; i--) {
    // For each term, compute the new fraction 
    // a_i + 1/previous
    const newNumerator = terms[i] * numerator + denominator;
    const newDenominator = numerator;

    // Update for next iteration
    numerator = newNumerator;
    denominator = newDenominator;
  }

  return [numerator, denominator];
}
/**
 * Generates all convergents (approximations) from continued fraction terms
 * @param terms Array of continued fraction terms
 * @returns Array of [numerator, denominator] pairs
 */
export function getConvergents(terms: number[]): Array<[number, number]> {
  const convergents: Array<[number, number]> = [];

  for (let i = 1; i <= terms.length; i++) {
    convergents.push(fromContinuedFraction(terms.slice(0, i)));
  }

  return convergents;
}

/**
 * Checks if a continued fraction has a repeating pattern
 * @param terms Array of continued fraction terms
 * @returns true if a repeating pattern is detected
 */
export function hasRepeatingPattern(terms: number[]): boolean {
  // Need at least a few terms to detect patterns
  if (terms.length < 6) return false;

  // Check for all same value after first term (like √2 = [1; 2, 2, 2, ...])
  const allSameAfterFirst = terms.slice(1).every(t => t === terms[1]);
  if (allSameAfterFirst) return true;

  // TODO: Implement more sophisticated pattern detection

  return false;
}

/**
 * Tries to identify if a number is a simple quadratic irrational
 * @param x The number to check
 * @returns The identified form or null if not recognized
 */
export function identifyQuadraticIrrational(x: number): string | null {
  const terms = toContinuedFraction(x, 30);

  // Check for √n pattern
  if (terms[0] >= 1 && hasRepeatingPattern(terms)) {
    // For √n where n is a perfect square + 1, the pattern is [a, 2*a]
    // This is a simple heuristic, actual algorithm would be more complex
    return null; // Placeholder
  }

  return null;
}