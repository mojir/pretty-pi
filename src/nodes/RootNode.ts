import { ExprNode } from './ExprNode'
import { NumberNode } from './NumberNode'
import { BinaryOpNode } from './BinaryOpNode'
import { factorizeRadicand } from '../utils/factorization'

/**
 * Specialized node for square roots for nicer formatting
 */
export class RootNode extends ExprNode {
  constructor(private operand: ExprNode) {
    super()
  }

  evaluate(): number {
    return Math.sqrt(this.operand.evaluate())
  }

  toString(): string {
    return `√${this.operand.toString()}`
  }

  simplify(): ExprNode {
    const operand = this.operand.simplify()

    // Simplify sqrt of perfect squares
    if (operand instanceof NumberNode) {
      const val = operand.evaluate()
      const sqrtVal = Math.sqrt(val)

      // If it's a perfect square, return the number
      if (Number.isInteger(sqrtVal)) {
        return new NumberNode(sqrtVal)
      }

      // Otherwise, check if we can simplify the radicand
      const factorized = factorizeRadicand(val)
      if (factorized.coefficient > 1) {
        // If there's a perfect square factor, extract it
        return new BinaryOpNode(
          '*',
          new NumberNode(factorized.coefficient),
          new RootNode(new NumberNode(factorized.radicand)),
        )
      }
    }

    // Handle product of radicands under a root
    if (operand instanceof BinaryOpNode && operand.getOp() === '*') {
      const left = operand.getLeft()
      const right = operand.getRight()

      // We can't simplify if they aren't both numbers
      if (left instanceof NumberNode && right instanceof NumberNode) {
        const leftVal = left.evaluate()
        const rightVal = right.evaluate()

        // Try to factorize the product
        const factorized = factorizeRadicand(leftVal * rightVal)
        if (factorized.coefficient > 1) {
          // If there's a perfect square factor, extract it
          return new BinaryOpNode(
            '*',
            new NumberNode(factorized.coefficient),
            new RootNode(new NumberNode(factorized.radicand)),
          ).simplify()
        }
      }
    }

    return new RootNode(operand)
  }

  getOperand(): ExprNode {
    return this.operand
  }

  equals(other: ExprNode): boolean {
    if (!(other instanceof RootNode))
      return false
    return this.operand.equals((other).getOperand())
  }
}