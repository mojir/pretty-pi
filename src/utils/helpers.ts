import { ExprNode } from '../nodes/ExprNode'
import { NumberNode } from '../nodes/NumberNode'
import { RootNode } from '../nodes/RootNode'
import { UnaryOpNode } from '../nodes/UnaryOpNode'

/**
 * Checks if a node represents exactly zero within epsilon tolerance
 */
export function isZero(node: ExprNode): boolean {
  return node instanceof NumberNode && Math.abs(node.evaluate()) < 1e-10
}

/**
 * Checks if a node represents exactly one within epsilon tolerance
 */
export function isOne(node: ExprNode): boolean {
  return node instanceof NumberNode && Math.abs(node.evaluate() - 1) < 1e-10
}

/**
 * Helper function to determine expression type priority for ordering
 * @returns A priority number (lower number = higher priority)
 */
export function getExpressionPriority(node: ExprNode): number {
  // Priority order: Number < Root/Power < Constant < Other
  if (node instanceof NumberNode)
    return 1
  if (node instanceof RootNode)
    return 2
  // Handle other node types here
  return 6 // Default for other types
}

/**
 * Determines if two expressions should be swapped in multiplication
 * @returns true if expressions should be swapped
 */
export function shouldSwapInMultiplication(left: ExprNode, right: ExprNode): boolean {
  const leftPriority = getExpressionPriority(left)
  const rightPriority = getExpressionPriority(right)

  // Lower priority number should come first
  return leftPriority > rightPriority
}

/**
 * Checks if a node represents a square root expression
 */
export function isRootNode(node: ExprNode): boolean {
  return node instanceof RootNode
    || (node instanceof UnaryOpNode && node.getOp() === 'sqrt')
}

/**
 * Extracts the radicand from a square root expression
 */
export function getRootOperand(node: ExprNode): ExprNode {
  if (node instanceof RootNode) {
    return node.getOperand()
  }
  if (node instanceof UnaryOpNode && node.getOp() === 'sqrt') {
    return node.getOperand()
  }
  throw new Error('Not a root node')
}