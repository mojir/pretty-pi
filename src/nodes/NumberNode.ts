import { ExprNode } from './ExprNode'
import { findGCD } from '../utils/factorization'
import { isNumberNode } from '../utils/typeguard'
import { CONFIG } from '../utils/constants'

/**
 * Checks if a node represents exactly zero within epsilon tolerance
 */
export function isZero(node: ExprNode): boolean {
  return isNumberNode(node) && Math.abs(node.evaluate()) < 1e-10
}

/**
 * Checks if a node represents exactly one within epsilon tolerance
 */
export function isOne(node: ExprNode): boolean {
  return isNumberNode(node) && Math.abs(node.evaluate() - 1) < 1e-10
}

/**
 * Node for numeric constants (integers, simple fractions, etc.)
 */
export class NumberNode extends ExprNode {
  public readonly type = 'Number'

  constructor(private value: number) {
    super()
  }

  evaluate(): number {
    return this.value
  }


  toString(): string {
    // Round values extremely close to zero to exactly zero
    if (Math.abs(this.value) < CONFIG.epsilon) {
      return "0";
    }

    if (this.value === Number.POSITIVE_INFINITY) {
      return "∞"
    }
    if (this.value === Number.NEGATIVE_INFINITY) {
      return "-∞"
    }

    if (Number.isInteger(this.value)) {
      return this.value.toString()
    }

    // Handle fractions if it's a "nice" fraction
    const MAX_DENOMINATOR = 1000
    for (let denominator = 2; denominator <= MAX_DENOMINATOR; denominator++) {
      const numerator = Math.round(this.value * denominator)
      if (Math.abs(this.value - numerator / denominator) < CONFIG.epsilon) {
        const gcd = findGCD(Math.abs(numerator), denominator)
        return CONFIG.spaceSeparation ? `${numerator / gcd} / ${denominator / gcd}` : `${numerator / gcd}/${denominator / gcd}`
      }
    }

    // Just return the decimal representation
    const valueStr = this.value.toString()
    if (valueStr.includes('.')) {
      const [, decimalPart] = valueStr.split('.')
      if (decimalPart.length > 8) {
        return this.value.toFixed(CONFIG.precision)
      }
    }
    return this.value.toString()
  }

  simplify(): ExprNode {
    return this // Numbers are already in simplest form
  }

  equals(other: ExprNode): boolean {
    if (!(isNumberNode(other)))
      return false
    return Math.abs(this.value - other.evaluate()) < CONFIG.epsilon
  }
}