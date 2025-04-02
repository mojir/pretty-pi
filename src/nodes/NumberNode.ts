import { ExprNode } from './ExprNode'
import { findGCD } from '../utils/factorization'

/**
 * Node for numeric constants (integers, simple fractions, etc.)
 */
export class NumberNode extends ExprNode {
  constructor(private value: number) {
    super()
  }

  evaluate(): number {
    return this.value
  }


  toString(): string {
    const EPSILON = 1e-10

    // Round values extremely close to zero to exactly zero
    if (Math.abs(this.value) < EPSILON) {
      return "0";
    }

    if (Number.isInteger(this.value)) {
      return this.value.toString()
    }

    // Handle fractions if it's a "nice" fraction
    const MAX_DENOMINATOR = 1000
    for (let denominator = 2; denominator <= MAX_DENOMINATOR; denominator++) {
      const numerator = Math.round(this.value * denominator)
      if (Math.abs(this.value - numerator / denominator) < EPSILON) {
        const gcd = findGCD(Math.abs(numerator), denominator)
        return `${numerator / gcd}/${denominator / gcd}`
      }
    }

    // Just return the decimal representation
    if (this.value.toString().length > 10) {
      return this.value.toFixed(8)
    }
    return this.value.toString()
  }

  simplify(): ExprNode {
    return this // Numbers are already in simplest form
  }

  equals(other: ExprNode): boolean {
    if (!(other instanceof NumberNode))
      return false
    const EPSILON = 1e-10
    return Math.abs(this.value - other.evaluate()) < EPSILON
  }
}