import { ExprNode } from './ExprNode'
import { NumberNode } from './NumberNode'

/**
 * Node for unary operations (-, sqrt, cbrt, etc.)
 */
export class UnaryOpNode extends ExprNode {
  constructor(private op: '-' | 'sqrt' | 'cbrt', private operand: ExprNode) {
    super()
  }

  evaluate(): number {
    const val = this.operand.evaluate()
    switch (this.op) {
      case '-': return -val
      case 'sqrt': return Math.sqrt(val)
      case 'cbrt': return Math.cbrt(val)
    }
  }

  toString(): string {
    const operandStr = this.operand.toString()
    if (operandStr === '0') {
      return '0'
    }

    switch (this.op) {
      case '-': return `-${operandStr}`
      case 'sqrt': return `√${operandStr}`
      case 'cbrt': return `∛${operandStr}`
    }
  }

  simplify(): ExprNode {
    const operand = this.operand.simplify()

    // Double negation: --a = a
    if (this.op === '-' && operand instanceof UnaryOpNode
      && (operand).getOp() === '-') {
      return (operand).getOperand()
    }

    // Simplify sqrt of perfect squares
    if (this.op === 'sqrt' && operand instanceof NumberNode) {
      const val = operand.evaluate()
      const sqrtVal = Math.sqrt(val)
      if (Number.isInteger(sqrtVal)) {
        return new NumberNode(sqrtVal)
      }
    }

    // Simplify cbrt of perfect cubes
    if (this.op === 'cbrt' && operand instanceof NumberNode) {
      const val = operand.evaluate()
      const cbrtVal = Math.cbrt(val)
      if (Number.isInteger(cbrtVal)) {
        return new NumberNode(cbrtVal)
      }
    }

    return new UnaryOpNode(this.op, operand)
  }

  getOp(): string {
    return this.op
  }

  getOperand(): ExprNode {
    return this.operand
  }

  equals(other: ExprNode): boolean {
    if (!(other instanceof UnaryOpNode))
      return false
    const otherOp = other
    return this.op === otherOp.getOp()
      && this.operand.equals(otherOp.getOperand())
  }
}