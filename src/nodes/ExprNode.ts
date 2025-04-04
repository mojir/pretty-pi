/**
 * Base abstract class for all expression nodes
 */
export abstract class ExprNode {
  public abstract readonly type: 'Root' | 'UnaryOp' | 'BinaryOp' | 'Constant' | 'Number' | 'Power'
  /**
   * Computes the numerical value of the expression
   */
  abstract evaluate(): number

  /**
   * Renders the expression as a formatted string
   */
  abstract toString(): string

  /**
   * Simplifies the expression
   */
  abstract simplify(): ExprNode

  /**
   * Checks if this node equals another node
   */
  abstract equals(other: ExprNode): boolean
}