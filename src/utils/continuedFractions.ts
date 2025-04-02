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

    // Prevent division by zero and avoid floating point issues
    const remainder = x - a;
    if (Math.abs(remainder) < EPSILON) {
      break;
    }

    x = 1 / remainder;
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
  const EPSILON = 1e-10;

  // Direct checks for common values

  // Check for square roots of integers
  for (let n = 2; n <= 20; n++) {
    if (Math.abs(x - Math.sqrt(n)) < EPSILON) {
      return `√${n}`;
    }
  }

  // Check for golden ratio and its conjugate
  if (Math.abs(x - (1 + Math.sqrt(5)) / 2) < EPSILON) {
    return "φ"; // Already defined as a constant
  }

  if (Math.abs(x - (Math.sqrt(5) - 1) / 2) < EPSILON) {
    return "(√5-1)/2";
  }

  // Check for expressions of form (√n ± m)/k where n, m, k are small integers
  for (let n = 2; n <= 30; n++) {
    const sqrtN = Math.sqrt(n);

    for (let m = 1; m <= 10; m++) {
      for (let k = 2; k <= 10; k++) {
        // Check (√n + m)/k
        if (Math.abs(x - (sqrtN + m) / k) < EPSILON) {
          if (m === 1 && k === 2) {
            return `(√${n}+1)/2`;
          } else {
            return `(√${n}+${m})/${k}`;
          }
        }

        // Check (√n - m)/k
        if (Math.abs(x - (sqrtN - m) / k) < EPSILON) {
          if (m === 1 && k === 2) {
            return `(√${n}-1)/2`;
          } else {
            return `(√${n}-${m})/${k}`;
          }
        }
      }
    }
  }

  // Get continued fraction for pattern analysis
  const terms = toContinuedFraction(x, 30);

  // Analyze the continued fraction for periodic patterns
  const period = detectPeriod(terms);

  if (period) {
    // For purely periodic CFs (√D): [a0; a1, a2, ..., aN, a1, a2, ...]
    // where a0 = floor(√D) and the sequence after a0 is periodic

    // For √2: [1; 2, 2, 2, ...]
    if (period.length === 1 && period[0] === 2 && terms[0] === 1) {
      return "√2";
    }

    // For √3: [1; 1, 2, 1, 2, ...]
    if (period.length === 2 && period[0] === 1 && period[1] === 2 && terms[0] === 1) {
      return "√3";
    }

    // For √5: [2; 4, 4, 4, ...]
    if (period.length === 1 && period[0] === 4 && terms[0] === 2) {
      return "√5";
    }

    // For √6: [2; 2, 4, 2, 4, ...] 
    if (period.length === 2 && period[0] === 2 && period[1] === 4 && terms[0] === 2) {
      return "√6";
    }

    // For √7: [2; 1, 1, 1, 4, 1, 1, 1, 4, ...] 
    if (period.length === 4 &&
      period[0] === 1 && period[1] === 1 &&
      period[2] === 1 && period[3] === 4 &&
      terms[0] === 2) {
      return "√7";
    }

    // For √8: [2; 1, 4, 1, 4, ...]
    if (period.length === 2 && period[0] === 1 && period[1] === 4 && terms[0] === 2) {
      return "√8";
    }

    // Try to reconstruct the quadratic form from the pattern
    // (Complex algorithm that would determine D from periodic CF)
    const D = reconstructD(terms[0], period);
    if (D > 0 && Math.abs(x - Math.sqrt(D)) < EPSILON) {
      return `√${D}`;
    }
  }

  return null; // Could not identify
}

// Helper function to detect periodic patterns in continued fractions
function detectPeriod(terms: number[]): number[] | null {
  // Need at least a few terms to detect patterns
  if (terms.length < 6) return null;

  // Check for single repeating digit (like √2 = [1; 2, 2, 2, ...])
  const allSameAfterFirst = terms.slice(1).every(t => t === terms[1]);
  if (allSameAfterFirst) {
    return [terms[1]];
  }

  // For period of length 2
  const periodLength2 = terms.slice(1, 3).every((val, idx) => {
    for (let i = 1; i < Math.floor((terms.length - 1) / 2); i++) {
      if (terms[1 + idx + 2 * i] !== val) return false;
    }
    return true;
  });

  if (periodLength2) {
    return terms.slice(1, 3);
  }

  // For period of length 4
  if (terms.length >= 9) {
    const periodLength4 = terms.slice(1, 5).every((val, idx) => {
      return terms[1 + idx + 4] === val && (terms.length >= 13 ? terms[1 + idx + 8] === val : true);
    });

    if (periodLength4) {
      return terms.slice(1, 5);
    }
  }

  // Could add more pattern detection logic here

  return null;
}

// Helper function to reconstruct D from continued fraction pattern
function reconstructD(a0: number, period: number[]): number {
  // Simple cases
  if (period.length === 1 && period[0] === 2) return 2;
  if (period.length === 2 && period[0] === 1 && period[1] === 2) return 3;
  if (period.length === 1 && period[0] === 4) return 5;
  if (period.length === 2 && period[0] === 2 && period[1] === 4) return 6;
  if (period.length === 4 &&
    period[0] === 1 && period[1] === 1 &&
    period[2] === 1 && period[3] === 4) return 7;
  if (period.length === 2 && period[0] === 1 && period[1] === 4) return 8;

  // For purely periodic CFs, D = a0² + P where P depends on the period
  // This is a simplified heuristic approach
  if (period.length === 1) {
    // If period has form [n], then D ≈ a0² + 1/n
    return Math.round(a0 * a0 + 1 / period[0]);
  }

  // Generalized approach for reconstructing D would be more complex
  // and would involve solving the Pell equation

  return -1; // Couldn't determine D
}