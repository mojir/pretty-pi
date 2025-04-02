/**
 * Factorizes a number under a radical to extract perfect square factors
 * @param n The number to factorize
 * @returns Object containing the coefficient and remaining radicand
 */
export function factorizeRadicand(n: number): { coefficient: number, radicand: number } {
  // Find largest perfect square factor
  let coefficient = 1
  let i = 2

  while (i * i <= n) {
    // Check if i² is a factor of n
    if (n % (i * i) === 0) {
      coefficient *= i
      n /= (i * i)
      // Continue with the same i to check for multiple powers
      continue
    }
    i++
  }

  return { coefficient, radicand: n }
}

/**
 * Finds the greatest common divisor of two numbers
 * @param a First number
 * @param b Second number
 * @returns The GCD of a and b
 */
export function findGCD(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

/**
 * Checks if a number is prime
 * @param n The number to check
 * @returns True if n is prime, false otherwise
 */
export function isPrime(n: number): boolean {
  if (n <= 1)
    return false
  if (n <= 3)
    return true
  if (n % 2 === 0 || n % 3 === 0)
    return false

  let i = 5
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0)
      return false
    i += 6
  }
  return true
}

/**
 * Determines if a number's square root should be preserved in direct form
 * @param n The number to check
 * @returns True if the square root should be kept in direct form
 */
export function shouldPreserveDirectRadical(n: number): boolean {
  // Always preserve direct form for prime numbers
  if (isPrime(n))
    return true

  // Always preserve direct form for small integers
  if (n <= 30)
    return true

  // Check if n has any perfect square factors
  const factorized = factorizeRadicand(n)

  // If no perfect square factors were found, preserve direct form
  return factorized.coefficient === 1
}