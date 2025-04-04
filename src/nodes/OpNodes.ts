import { CONFIG } from '../utils/constants'
import { factorizeRadicand, findGCD } from '../utils/factorization'
import { shouldSwapInMultiplication } from '../utils/shouldSwapInMultiplication'
import { isBinaryOpNode, isNumberNode, isPowerNode, isRootNode, isUnaryOpNode } from '../utils/typeguard'
import { ExprNode } from './ExprNode'
import { isOne, isZero, NumberNode } from './NumberNode'

/**
 * Node for binary operations (+, -, *, /)
 */
export class BinaryOpNode extends ExprNode {
  public readonly type = 'BinaryOp'
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
      && (isBinaryOpNode(this.left) && (this.left.getOp() === '+' || this.left.getOp() === '-'))) {
      leftStr = `(${leftStr})`
    }

    else if ((this.op === '+' || this.op === '-')
      && (isBinaryOpNode(this.right) && (this.right.getOp() === '+' || this.right.getOp() === '-'))) {
      rightStr = `(${rightStr})`
    }

    if (this.op === '*') {
      // Double-check order at display time
      if (shouldSwapInMultiplication(this.left, this.right)) {
        return CONFIG.spaceSeparation
          ? `${this.right.toString()} · ${this.left.toString()}`
          : `${this.right.toString()}·${this.left.toString()}`
      }
      return CONFIG.spaceSeparation
        ? `${this.left.toString()} · ${this.right.toString()}`
        : `${this.left.toString()}·${this.right.toString()}`
    }
    else {
      return CONFIG.spaceSeparation
        ? `${leftStr} ${this.op} ${rightStr}`
        : `${leftStr}${this.op}${rightStr}`
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
    if (isNumberNode(left) && isNumberNode(right)) {
      return new NumberNode(this.evaluate())
    }

    // Simplification rules for addition
    if (this.op === '+') {
      // a + 0 = a
      if (isNumberNode(right) && right.evaluate() === 0) {
        return left
      }
      // 0 + a = a
      if (isNumberNode(left) && left.evaluate() === 0) {
        return right
      }
    }

    // Simplification rules for subtraction
    if (this.op === '-') {
      // a - 0 = a
      if (isNumberNode(right) && right.evaluate() === 0) {
        return left
      }
      // 0 - a = -a
      if (isNumberNode(left) && left.evaluate() === 0) {
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
      if (isNumberNode(left)
        && isBinaryOpNode(right)
        && right.getOp() === '/'
        && isNumberNode(right.getRight())
        && right.getRight().evaluate() === 2
        && isRootNode(right.getLeft())) {
        const n = left.evaluate()
        const rootNode = right.getLeft() as RootNode
        return new BinaryOpNode('*', new NumberNode(n / 2), rootNode)
      }

      // Handle multiplications with fractions
      if (isBinaryOpNode(left) && left.getOp() === '/') {
        // (a/b) * c = (a*c)/b
        const fraction = left
        const numerator = fraction.getLeft()
        const denominator = fraction.getRight()
        return new BinaryOpNode('/', new BinaryOpNode('*', numerator, right), denominator).simplify()
      }

      if (isBinaryOpNode(right) && right.getOp() === '/') {
        // c * (a/b) = (c*a)/b
        const fraction = right
        const numerator = fraction.getLeft()
        const denominator = fraction.getRight()
        return new BinaryOpNode('/', new BinaryOpNode('*', left, numerator), denominator).simplify()
      }

      // Multiple numeric factors: (2·3)·π = 6·π
      if (isNumberNode(left)
        && isBinaryOpNode(right)
        && right.getOp() === '*'
        && isNumberNode(right.getLeft())) {
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
        if (isNumberNode(leftOperand) && isNumberNode(rightOperand)) {
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
      if (isNumberNode(left) && isNumberNode(right)) {
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
      if (isBinaryOpNode(left) && left.getOp() === '*') {
        const product = left

        // Case for n·something / n = something (6·√3/6 = √3)
        if (isNumberNode(product.getLeft())
          && isNumberNode(right)
          && Math.abs(product.getLeft().evaluate() - right.evaluate()) < 1e-10) {
          return product.getRight()
        }

        if (isNumberNode(product.getRight())
          && isNumberNode(right)
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
    if (!(isBinaryOpNode(other)))
      return false
    const otherOp = other
    return this.op === otherOp.getOp()
      && this.left.equals(otherOp.getLeft())
      && this.right.equals(otherOp.getRight())
  }
}

/**
 * Extracts the radicand from a square root expression
 */
export function getRootOperand(node: ExprNode): ExprNode {
  if (isRootNode(node)) {
    return node.getOperand()
  }
  if (isUnaryOpNode(node) && node.getOp() === 'sqrt') {
    return node.getOperand()
  }
  throw new Error('Not a root node')
}

/**
 * Checks if a node represents a square root expression
 */
export function isRootLikeNode(node: ExprNode): node is RootNode | UnaryOpNode {
  return isRootNode(node)
    || (isUnaryOpNode(node) && node.getOp() === 'sqrt')
}

/**
 * Specialized node for square roots for nicer formatting
 */
export class RootNode extends ExprNode {
  public readonly type = 'Root'

  constructor(private operand: ExprNode) {
    super()
  }

  evaluate(): number {
    return Math.sqrt(this.operand.evaluate())
  }

  toString(): string {
    if (CONFIG.spaceSeparation) {
      const operandStr = this.operand.toString()
      if (!isNumberNode(this.operand) || operandStr.includes('/')) {
        return `√(${operandStr})`
      } else {
        return `√${operandStr}`
      }
    } else {
      return `√${this.operand.toString()}`
    }
  }

  simplify(): ExprNode {
    const operand = this.operand.simplify()

    // Simplify sqrt of perfect squares
    if (isNumberNode(operand)) {
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
    if (isBinaryOpNode(operand) && operand.getOp() === '*') {
      const left = operand.getLeft()
      const right = operand.getRight()

      // We can't simplify if they aren't both numbers
      if (isNumberNode(left) && isNumberNode(right)) {
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
    if (!(isRootLikeNode(other)))
      return false
    return this.operand.equals(other.getOperand())
  }
}

/**
 * Specialized node for power expressions
 */

export class PowerNode extends ExprNode {
  public readonly type = 'Power';

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

    return CONFIG.spaceSeparation ? `${baseStr} ^ ${this.exponent.toString()}` : `${baseStr}^${this.exponent.toString()}`
  }

  simplify(): ExprNode {
    const base = this.base.simplify()
    const exponent = this.exponent.simplify()

    // Anything to the power of 0 is 1
    if (isNumberNode(exponent) && exponent.evaluate() === 0) {
      return new NumberNode(1)
    }

    // Anything to the power of 1 is itself
    if (isNumberNode(exponent) && exponent.evaluate() === 1) {
      return base
    }

    // 0 to any positive power is 0
    if (isNumberNode(base) && base.evaluate() === 0
      && isNumberNode(exponent) && exponent.evaluate() > 0) {
      return new NumberNode(0)
    }

    // 1 to any power is 1
    if (isNumberNode(base) && base.evaluate() === 1) {
      return new NumberNode(1)
    }

    // If both are numbers, compute the power
    if (isNumberNode(base) && isNumberNode(exponent)) {
      return new NumberNode(base.evaluate() ** exponent.evaluate())
    }

    return new PowerNode(base, exponent)
  }

  equals(other: ExprNode): boolean {
    if (!(isPowerNode(other)))
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
/**
 * Node for unary operations (-, sqrt, cbrt, etc.)
 */

export class UnaryOpNode extends ExprNode {
  public readonly type = 'UnaryOp';

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
      case '-': return CONFIG.spaceSeparation && (!isNumberNode(this.operand) || operandStr.includes('/')) ? `-(${operandStr})` : `-${operandStr}`
      case 'sqrt': return CONFIG.spaceSeparation ? `√(${operandStr})` : `√${operandStr}`
      case 'cbrt': return CONFIG.spaceSeparation ? `∛(${operandStr})` : `∛${operandStr}`
    }
  }

  simplify(): ExprNode {
    const operand = this.operand.simplify()

    // Double negation: --a = a
    if (this.op === '-' && isUnaryOpNode(operand)
      && operand.getOp() === '-') {
      return operand.getOperand()
    }

    // Simplify sqrt of perfect squares
    if (this.op === 'sqrt' && isNumberNode(operand)) {
      const val = operand.evaluate()
      const sqrtVal = Math.sqrt(val)
      if (Number.isInteger(sqrtVal)) {
        return new NumberNode(sqrtVal)
      }
    }

    // Simplify cbrt of perfect cubes
    if (this.op === 'cbrt' && isNumberNode(operand)) {
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
    if (!(isUnaryOpNode(other)))
      return false
    const otherOp = other
    return this.op === otherOp.getOp()
      && this.operand.equals(otherOp.getOperand())
  }
}

