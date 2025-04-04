import { BinaryOpNode, RootNode } from "../nodes/OpNodes"
import { ConstantNode } from "../nodes/ConstantNode"
import { ExprNode } from "../nodes/ExprNode"
import { NumberNode } from "../nodes/NumberNode"
import { PowerNode } from '../nodes/OpNodes'
import { UnaryOpNode } from '../nodes/OpNodes'
import { CONFIG, CONSTANTS, TRIG_VALUES } from "../utils/constants"
import { getConvergents, identifyQuadraticIrrational, toContinuedFraction } from "../utils/continuedFractions"
import { shouldPreserveDirectRadical, factorizeRadicand, isPrime } from "../utils/factorization"
import { isConstantNode, isNumberNode } from "../utils/typeguard"

/**
 * Parser to convert numeric values to expression trees
 */
export class ExpressionParser {
  /**
   * Main parsing function that converts a number to an expression tree
   */
  parseNumber(num: number, depth: number = 0): ExprNode {
    const MAX_DEPTH = 3

    // Handle zero
    if (Math.abs(num) < CONFIG.epsilon) {
      return new NumberNode(0)
    }

    // Handle negative numbers
    if (num < 0) {
      return new UnaryOpNode('-', this.parseNumber(-num, depth))
    }

    // Handle integers
    if (Math.abs(num - Math.round(num)) < CONFIG.epsilon) {
      return new NumberNode(Math.round(num))
    }


    const cfTerms = toContinuedFraction(num, 20);
    const convergents = getConvergents(cfTerms);

    for (const [numerator, denominator] of convergents) {
      // Only consider fractions with reasonably-sized components
      if (denominator <= 1000 && Math.abs(numerator) <= 10000) {
        // Verify the approximation is within our epsilon
        if (Math.abs(num - numerator / denominator) < CONFIG.epsilon) {
          const gcd = this.findGCD(Math.abs(numerator), denominator);
          return new BinaryOpNode(
            '/',
            new NumberNode(numerator / gcd),
            new NumberNode(denominator / gcd)
          );
        }
      }
    }


    // Try direct matches to constants
    for (const constant of CONSTANTS) {
      if (Math.abs(num - constant.value) < CONFIG.epsilon) {
        return new ConstantNode(constant.getSymbol(), constant.value)
      }
    }

    // Try direct matches to trig values
    for (const trigValue of TRIG_VALUES) {
      if (Math.abs(num - trigValue.value) < CONFIG.epsilon) {
        // If it has an exact form, parse that instead
        if (trigValue.getExactForm) {
          return this.parseExactForm(trigValue.getExactForm())
        }
        return new ConstantNode(trigValue.getSymbol(), trigValue.value)
      }
    }

    const quadraticForm = identifyQuadraticIrrational(num);
    if (quadraticForm) {
      // If we identified something like "√7" or "(√13-3)/2"
      return this.parseExactForm(quadraticForm);
    }

    // Direct check for square roots before other decompositions
    // This ensures square roots of integers are handled directly
    for (let i = 2; i <= 100; i++) {
      if (Math.abs(num - Math.sqrt(i)) < CONFIG.epsilon) {
        // Use our enhanced check to determine if we should keep direct form
        if (shouldPreserveDirectRadical(i)) {
          return new RootNode(new NumberNode(i))
        }

        // Only factorize if appropriate
        const factorized = factorizeRadicand(i)
        if (factorized.coefficient > 1) {
          return new BinaryOpNode(
            '*',
            new NumberNode(factorized.coefficient),
            new RootNode(new NumberNode(factorized.radicand)),
          )
        }

        // Default to direct representation
        return new RootNode(new NumberNode(i))
      }
    }

    // Check for powers
    for (const constant of [...CONSTANTS, ...TRIG_VALUES]) {
      for (let power = 2; power <= 3; power++) {
        if (Math.abs(num - constant.value ** power) < CONFIG.epsilon) {
          const baseNode = constant.getExactForm
            ? this.parseExactForm(constant.getExactForm())
            : new ConstantNode(constant.getSymbol(), constant.value)
          return new PowerNode(baseNode, new NumberNode(power))
        }
      }
    }

    // Recursive decomposition with extra care for square roots
    if (depth < MAX_DEPTH) {
      // Check for π/n pattern
      for (const constant of CONSTANTS) {
        for (let denominator = 2; denominator <= 12; denominator++) {
          if (Math.abs(num - constant.value / denominator) < CONFIG.epsilon) {
            return new BinaryOpNode('/',
              constant.getExactForm
                ? this.parseExactForm(constant.getExactForm())
                : new ConstantNode(constant.getSymbol(), constant.value),
              new NumberNode(denominator)
            )
          }
        }
      }

      // Check for products with more careful handling of square roots
      for (const constant of [...CONSTANTS, ...TRIG_VALUES]) {
        if (Math.abs(constant.value) > CONFIG.epsilon) {
          const multiplier = num / constant.value

          // Skip square root decomposition attempts for prime square roots
          if (constant.getSymbol() && constant.getSymbol().startsWith('√')
            && isPrime(Number.parseInt(constant.getSymbol(true).substring(1)))) {
            continue
          }

          // Skip common fractions that might be misidentified as complex expressions
          if ((Math.abs(multiplier - 0.75) < CONFIG.epsilon)
            || (Math.abs(multiplier - 0.5) < CONFIG.epsilon)
            || (Math.abs(multiplier - 0.25) < CONFIG.epsilon)
            || (Math.abs(multiplier - 0.3333333333333333) < CONFIG.epsilon)
            || (Math.abs(multiplier - 0.6666666666666666) < CONFIG.epsilon)) {
            continue
          }

          if (this.isNiceValue(multiplier)) {
            const multiplierNode = this.parseNumber(multiplier, depth + 1)
            const valueNode = constant.getExactForm
              ? this.parseExactForm(constant.getExactForm())
              : new ConstantNode(constant.getSymbol(), constant.value)

            // If multiplier is 1, just return the constant
            if (isNumberNode(multiplierNode)
              && Math.abs(multiplierNode.evaluate() - 1) < CONFIG.epsilon) {
              return valueNode
            }

            // Create the product node with canonical ordering
            let productNode

            // Define a priority order for constants
            // Lower number = higher priority (should appear first)
            const getConstantPriority = (node: ExprNode) => {
              if (!(isConstantNode(node)))
                return 100

              const symbol = node.getSymbol()
              if (symbol === 'e')
                return 1
              if (symbol === 'π')
                return 2
              if (symbol === 'φ')
                return 3
              if (symbol.startsWith('√'))
                return 10
              return 50 // Other constants
            }

            // Apply the priority ordering
            if (isConstantNode(multiplierNode) && isConstantNode(valueNode)) {
              // When multiplying two constants, order them by priority
              const multiplierPriority = getConstantPriority(multiplierNode)
              const valuePriority = getConstantPriority(valueNode)

              if (multiplierPriority <= valuePriority) {
                productNode = new BinaryOpNode('*', multiplierNode, valueNode)
              }
              else {
                productNode = new BinaryOpNode('*', valueNode, multiplierNode)
              }
            }
            else if (isNumberNode(multiplierNode)) {
              // Number multiplier always goes first
              productNode = new BinaryOpNode('*', multiplierNode, valueNode)
            }
            else if (getConstantPriority(valueNode) < 50) {
              // Special constants (e, π, φ) go before other expressions
              productNode = new BinaryOpNode('*', valueNode, multiplierNode)
            }
            else {
              // Default ordering
              productNode = new BinaryOpNode('*', multiplierNode, valueNode)
            }

            // Check if this product is part of a sum
            // Try to see if the product plus a nice value equals our number
            for (let addend = 1; addend <= 10; addend++) {
              const productValue = productNode.evaluate()
              const sum = productValue + addend

              if (Math.abs(num - sum) < CONFIG.epsilon) {
                return new BinaryOpNode('+', productNode, new NumberNode(addend))
              }
            }

            return productNode
          }
        }
      }

      // Check for sums and differences with base constants
      for (const constant of [...CONSTANTS, ...TRIG_VALUES]) {
        const remainder = num - constant.value
        if (this.isNiceValue(remainder)) {
          const remainderNode = this.parseNumber(remainder, depth + 1)
          const valueNode = constant.getExactForm
            ? this.parseExactForm(constant.getExactForm())
            : new ConstantNode(constant.getSymbol(), constant.value)

          // If remainder is 0, just return the constant
          if (isNumberNode(remainderNode)
            && Math.abs(remainderNode.evaluate()) < CONFIG.epsilon) {
            return valueNode
          }

          // If remainder is negative, use subtraction
          if (remainder < 0) {
            return new BinaryOpNode('-', valueNode, this.parseNumber(-remainder, depth + 1))
          }

          return new BinaryOpNode('+', valueNode, remainderNode)
        }
      }

      // Check for sums and differences with multiples of constants
      for (const constant of [...CONSTANTS, ...TRIG_VALUES]) {
        for (let multiplier = 2; multiplier <= 5; multiplier++) {
          const multipleValue = multiplier * constant.value
          const remainder = num - multipleValue

          if (this.isNiceValue(remainder)) {
            // Create the multiple constant node
            const constantNode = constant.getExactForm
              ? this.parseExactForm(constant.getExactForm())
              : new ConstantNode(constant.getSymbol(), constant.value)
            const multipleNode = new BinaryOpNode('*', new NumberNode(multiplier), constantNode)

            // Create the remainder node
            const remainderNode = this.parseNumber(remainder, depth + 1)

            // If remainder is 0, just return the multiple
            if (isNumberNode(remainderNode)
              && Math.abs(remainderNode.evaluate()) < CONFIG.epsilon) {
              return multipleNode
            }

            // If remainder is negative, use subtraction
            if (remainder < 0) {
              return new BinaryOpNode('-', multipleNode, this.parseNumber(-remainder, depth + 1))
            }

            return new BinaryOpNode('+', multipleNode, remainderNode)
          }
        }
      }

      // Check for cube roots of integers
      for (let i = 2; i <= 100; i++) {
        if (Math.abs(num - Math.cbrt(i)) < CONFIG.epsilon) {
          return new UnaryOpNode('cbrt', new NumberNode(i))
        }
      }
    }

    // Final direct check for square roots before giving up
    // This ensures we catch any square roots we might have missed
    const possibleRadicand = Math.round(num * num)
    if (Math.abs(num - Math.sqrt(possibleRadicand)) < CONFIG.epsilon) {
      return new RootNode(new NumberNode(possibleRadicand))
    }

    // Fallback to decimal representation
    return new NumberNode(num)
  }

  /**
   * Helper method to parse exact forms like "√2/2"
   */
  private parseExactForm(exactForm: string): ExprNode {
    // Handle fractions
    if (exactForm.includes('/')) {
      const [numerator, denominator] = exactForm.split('/')
      return new BinaryOpNode('/', this.parseExactForm(numerator!), this.parseExactForm(denominator!))
    }

    // Handle square roots
    if (exactForm.startsWith('√')) {
      const argument = exactForm.substring(1)
      return new RootNode(this.parseExactForm(argument))
    }

    // Handle simple numbers
    if (/^\d+$/.test(exactForm)) {
      return new NumberNode(Number.parseInt(exactForm))
    }

    // Handle known constants
    for (const constant of CONSTANTS) {
      if (exactForm === constant.getSymbol()) {
        return new ConstantNode(constant.getSymbol(), constant.value)
      }
    }

    // If we don't recognize it, treat it as a symbol
    return new ConstantNode(exactForm, Number.NaN)
  }

  /**
   * Helper to determine if a value is "nice"
   */
  private isNiceValue(num: number): boolean {

    // Check if it's close to an integer
    if (Math.abs(num - Math.round(num)) < CONFIG.epsilon) {
      return true
    }

    const cfTerms = toContinuedFraction(num, 10);
    const convergents = getConvergents(cfTerms);

    // Check if any convergent is a good approximation and reasonably simple
    for (const [numerator, denominator] of convergents) {
      // Only consider "nice" fractions (reasonable size numerator/denominator)
      if (denominator <= 20 && Math.abs(numerator) <= 50) {
        if (Math.abs(num - numerator / denominator) < CONFIG.epsilon) {
          return true;
        }
      }
    }

    // Check if it's a square root of a small integer (highest priority)
    // This helps prefer direct √n forms
    for (let i = 2; i <= 30; i++) {
      if (Math.abs(num - Math.sqrt(i)) < CONFIG.epsilon) {
        // Give very high priority to prime square roots
        if (isPrime(i)) {
          return true
        }
        // Also prioritize other small square roots
        if (i <= 20) {
          return true
        }
      }
    }

    // Check if it's close to a common constant
    for (const constant of CONSTANTS) {
      if (Math.abs(num - constant.value) < CONFIG.epsilon) {
        return true
      }
    }

    // Check trig values
    for (const value of TRIG_VALUES) {
      if (Math.abs(num - value.value) < CONFIG.epsilon) {
        return true
      }
    }

    // Other common values with lower priority
    const COMMON_VALUES = [
      Math.sin(Math.PI / 3),
      Math.cos(Math.PI / 4),
    ]

    for (const value of COMMON_VALUES) {
      if (Math.abs(num - value) < CONFIG.epsilon) {
        return true
      }
    }

    return false
  }

  /**
   * Find greatest common divisor helper method
   */
  private findGCD(a: number, b: number): number {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }
}