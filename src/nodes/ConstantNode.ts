import { ExprNode } from './ExprNode'

/**
 * Node for mathematical constants (π, e, etc.)
 */
export class ConstantNode extends ExprNode {
  constructor(private symbol: string, private value: number) {
    super()
  }

  evaluate(): number {
    return this.value
  }

  toString(): string {
    return this.symbol
  }

  simplify(): ExprNode {
    return this // Constants are already in simplest form
  }

  equals(other: ExprNode): boolean {
    if (!(other instanceof ConstantNode))
      return false
    return this.symbol === other.symbol
  }

  getSymbol(): string {
    return this.symbol
  }
}