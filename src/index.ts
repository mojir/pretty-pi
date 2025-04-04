/**
 * Symbolic Number Printer using Expression Tree Representation
 *
 * This implementation uses a proper expression tree to represent mathematical
 * expressions, enabling more sophisticated simplification and consistent formatting.
 */

import { ExpressionParser } from "./parser/ExpressionParser"
import { Config, setConfig } from "./utils/constants"

/**
 * Main function to convert a number to its symbolic representation
 * @param num The number to convert to symbolic form
 * @returns A string containing the symbolic representation
 */
export function prettyPi(num: number, config: Partial<Config> = {}): string {
  setConfig(config)
  const parser = new ExpressionParser()
  const exprTree = parser.parseNumber(num)
  const simplified = exprTree.simplify()

  return simplified.toString()
}