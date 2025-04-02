import { findGCD } from '../utils/factorization'
import { getRootOperand, isOne, isRootNode, isZero, shouldSwapInMultiplication } from '../utils/helpers'
import { ExprNode } from './ExprNode'
import { NumberNode } from './NumberNode'
import { RootNode } from './RootNode'
import { UnaryOpNode } from './UnaryOpNode'

/**
 * Node for binary operations (+, -, *, /)
 */
export class BinaryOpNode extends ExprNode {
  constructor(
    private op: '+' | '-' | '*' | '/',
    private left: ExprNode,
    private right: ExprNode,
  ) {
    super()

    // Apply automatic ordering for multiplication operations
    if (this.op === '*' && shouldSwapInMultiplication(left, right)) {
      // Swap the operands if they're in the wrong order
      this.left = right
      this.right = left
    }
  }

  evaluate(): number {
    const leftVal = this.left.evaluate()
    const rightVal = this.right.evaluate()

    switch (this.op) {
      case '+': return leftVal + rightVal
      case '-': return leftVal - rightVal
      case '*': return leftVal * rightVal
      case '/': return leftVal / rightVal
    }
  }

  toString(): string {
    let leftStr = this.left.toString()
    let rightStr = this.right.toString()

    // Add parentheses if needed
    if ((this.op === '+' || this.op === '-')
      && (this.left instanceof BinaryOpNode
        && (this.left).getOp() === '+'
        || this.left instanceof BinaryOpNode
        && (this.left).getOp() === '-')) {
      leftStr = `(${leftStr})`
    }

    else if ((this.op === '+' || this.op === '-')
      && (this.right instanceof BinaryOpNode
        && (this.right).getOp() === '+'
        || this.right instanceof BinaryOpNode
        && (this.right).getOp() === '-')) {
      rightStr = `(${rightStr})`
    }

    if (this.op === '*') {
      // Double-check order at display time
      if (shouldSwapInMultiplication(this.left, this.right)) {
        return `${this.right.toString()}·${this.left.toString()}`
      }
      return `${this.left.toString()}·${this.right.toString()}`
    }
    else if (this.op === '/') {
      return `${leftStr}/${rightStr}`
    }
    else {
      return `${leftStr}${this.op}${rightStr}`
    }
  }

  getOp(): string {
    return this.op
  }

  getLeft(): ExprNode {
    return this.left
  }

  getRight(): ExprNode {
    return this.right
  }

  simplify(): ExprNode {
    // First simplify both children
    const left = this.left.simplify()
    const right = this.right.simplify()

    // If both are numbers, perform the operation
    if (left instanceof NumberNode && right instanceof NumberNode) {
      return new NumberNode(this.evaluate())
    }

    // Simplification rules for addition
    if (this.op === '+') {
      // a + 0 = a
      if (right instanceof NumberNode && right.evaluate() === 0) {
        return left
      }
      // 0 + a = a
      if (left instanceof NumberNode && left.evaluate() === 0) {
        return right
      }
    }

    // Simplification rules for subtraction
    if (this.op === '-') {
      // a - 0 = a
      if (right instanceof NumberNode && right.evaluate() === 0) {
        return left
      }
      // 0 - a = -a
      if (left instanceof NumberNode && left.evaluate() === 0) {
        return new UnaryOpNode('-', right)
      }
      // a - a = 0
      if (left.equals(right)) {
        return new NumberNode(0)
      }
    }

    // Simplification rules for multiplication
    if (this.op === '*') {
      // a * 0 = 0
      if (isZero(left) || isZero(right)) {
        return new NumberNode(0)
      }
      // a * 1 = a
      if (isOne(right)) {
        return left
      }
      // 1 * a = a
      if (isOne(left)) {
        return right
      }

      // Special case for n·√m/2 (12·√3/2 case)
      if (left instanceof NumberNode
        && right instanceof BinaryOpNode
        && right.getOp() === '/'
        && right.getRight() instanceof NumberNode
        && right.getRight().evaluate() === 2
        && right.getLeft() instanceof RootNode) {
        const n = left.evaluate()
        const rootNode = right.getLeft() as RootNode
        return new BinaryOpNode('*', new NumberNode(n / 2), rootNode)
      }

      // Handle multiplications with fractions
      if (left instanceof BinaryOpNode && (left).getOp() === '/') {
        // (a/b) * c = (a*c)/b
        const fraction = left
        const numerator = fraction.getLeft()
        const denominator = fraction.getRight()
        return new BinaryOpNode('/', new BinaryOpNode('*', numerator, right), denominator).simplify()
      }

      if (right instanceof BinaryOpNode && right.getOp() === '/') {
        // c * (a/b) = (c*a)/b
        const fraction = right
        const numerator = fraction.getLeft()
        const denominator = fraction.getRight()
        return new BinaryOpNode('/', new BinaryOpNode('*', left, numerator), denominator).simplify()
      }

      // Multiple numeric factors: (2·3)·π = 6·π
      if (left instanceof NumberNode
        && right instanceof BinaryOpNode
        && right.getOp() === '*'
        && right.getLeft() instanceof NumberNode) {
        const n1 = left.evaluate()
        const n2 = ((right).getLeft() as NumberNode).evaluate()
        const restTerm = right.getRight()
        return new BinaryOpNode('*', new NumberNode(n1 * n2), restTerm).simplify()
      }

      // Consolidate products of square roots: √a·√b = √(a·b)
      if (isRootNode(left) && isRootNode(right)) {
        const leftOperand = getRootOperand(left)
        const rightOperand = getRootOperand(right)

        // Create √(a·b) instead of √a·√b
        if (leftOperand instanceof NumberNode && rightOperand instanceof NumberNode) {
          const newRadicand = leftOperand.evaluate() * rightOperand.evaluate()
          return new RootNode(new NumberNode(newRadicand)).simplify()
        }
      }
    }

    // Simplification rules for division
    if (this.op === '/') {
      // 0 / a = 0
      if (isZero(left)) {
        return new NumberNode(0)
      }
      // a / 1 = a
      if (isOne(right)) {
        return left
      }
      // a / a = 1
      if (left.equals(right)) {
        return new NumberNode(1)
      }

      // Simplify numeric fractions
      if (left instanceof NumberNode && right instanceof NumberNode) {
        const num = left.evaluate()
        const denom = right.evaluate()

        if (Number.isInteger(num) && Number.isInteger(denom)) {
          const gcd = findGCD(Math.abs(num), Math.abs(denom))
          if (gcd > 1) {
            return new BinaryOpNode('/', new NumberNode(num / gcd), new NumberNode(denom / gcd))
          }
        }
      }

      // (a*b) / b = a
      if (left instanceof BinaryOpNode && (left).getOp() === '*') {
        const product = left

        // Case for n·something / n = something (6·√3/6 = √3)
        if (product.getLeft() instanceof NumberNode
          && right instanceof NumberNode
          && Math.abs(product.getLeft().evaluate() - right.evaluate()) < 1e-10) {
          return product.getRight()
        }

        if (product.getRight() instanceof NumberNode
          && right instanceof NumberNode
          && Math.abs(product.getRight().evaluate() - right.evaluate()) < 1e-10) {
          return product.getLeft()
        }

        // General case
        if (product.getLeft().equals(right)) {
          return product.getRight()
        }
        if (product.getRight().equals(right)) {
          return product.getLeft()
        }
      }
    }

    // If no simplification rules apply, return a new node with simplified children
    return new BinaryOpNode(this.op, left, right)
  }

  equals(other: ExprNode): boolean {
    if (!(other instanceof BinaryOpNode))
      return false
    const otherOp = other
    return this.op === otherOp.getOp()
      && this.left.equals(otherOp.getLeft())
      && this.right.equals(otherOp.getRight())
  }
}