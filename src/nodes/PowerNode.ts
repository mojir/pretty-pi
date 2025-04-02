import { ExprNode } from './ExprNode'
import { NumberNode } from './NumberNode'

/**
 * Specialized node for power expressions
 */
export class PowerNode extends ExprNode {
  constructor(private base: ExprNode, private exponent: ExprNode) {
    super()
  }

  evaluate(): number {
    return this.base.evaluate() ** this.exponent.evaluate()
  }

  toString(): string {
    const baseStr = this.base.toString()
    const expVal = this.exponent.evaluate()

    // Use superscript for powers 2 and 3
    if (expVal === 2)
      return `${baseStr}²`
    if (expVal === 3)
      return `${baseStr}³`

    return `${baseStr}^${this.exponent.toString()}`
  }

  simplify(): ExprNode {
    const base = this.base.simplify()
    const exponent = this.exponent.simplify()

    // Anything to the power of 0 is 1
    if (exponent instanceof NumberNode && exponent.evaluate() === 0) {
      return new NumberNode(1)
    }

    // Anything to the power of 1 is itself
    if (exponent instanceof NumberNode && exponent.evaluate() === 1) {
      return base
    }

    // 0 to any positive power is 0
    if (base instanceof NumberNode && base.evaluate() === 0
      && exponent instanceof NumberNode && exponent.evaluate() > 0) {
      return new NumberNode(0)
    }

    // 1 to any power is 1
    if (base instanceof NumberNode && base.evaluate() === 1) {
      return new NumberNode(1)
    }

    // If both are numbers, compute the power
    if (base instanceof NumberNode && exponent instanceof NumberNode) {
      return new NumberNode(base.evaluate() ** exponent.evaluate())
    }

    return new PowerNode(base, exponent)
  }

  equals(other: ExprNode): boolean {
    if (!(other instanceof PowerNode))
      return false
    const otherPower = other
    return this.base.equals(otherPower.base)
      && this.exponent.equals(otherPower.exponent)
  }

  getBase(): ExprNode {
    return this.base
  }

  getExponent(): ExprNode {
    return this.exponent
  }
}