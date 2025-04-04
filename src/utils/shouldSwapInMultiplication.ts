import { ExprNode } from "../nodes/ExprNode"
import { isNumberNode, isRootNode } from "./typeguard"

/**
 * Helper function to determine expression type priority for ordering
 * @returns A priority number (lower number = higher priority)
 */
function getExpressionPriority(node: ExprNode): number {
  // Priority order: Number < Root/Power < Constant < Other
  if (isNumberNode(node))
    return 1
  if (isRootNode(node))
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

