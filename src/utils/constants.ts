import { Constant } from '../types'

/**
 * Mathematical constants used for symbolic representation
 */
export const CONSTANTS: Constant[] = [
  { symbol: 'π', value: Math.PI },
  { symbol: 'e', value: Math.E },
  { symbol: 'φ', value: (1 + Math.sqrt(5)) / 2 },
  { symbol: '√2', value: Math.sqrt(2) },
  { symbol: '√3', value: Math.sqrt(3) },
  { symbol: '√5', value: Math.sqrt(5) },
  { symbol: '√7', value: Math.sqrt(7) },
  { symbol: '√11', value: Math.sqrt(11) },
  { symbol: '√13', value: Math.sqrt(13) },
  { symbol: '√17', value: Math.sqrt(17) },
  { symbol: '√19', value: Math.sqrt(19) },
  { symbol: '√π', value: Math.sqrt(Math.PI) },
  { symbol: 'ln(2)', value: Math.LN2 },
  { symbol: 'ln(10)', value: Math.LN10 },
  { symbol: 'log₂(e)', value: Math.LOG2E },
  { symbol: 'log₁₀(e)', value: Math.LOG10E },
]

/**
 * Trigonometric values with their exact symbolic representations
 */
export const TRIG_VALUES: Constant[] = [
  // sin values
  { value: Math.sin(Math.PI / 6), symbol: 'sin(π/6)', exactForm: '1/2' },
  { value: Math.sin(Math.PI / 4), symbol: 'sin(π/4)', exactForm: '√2/2' },
  { value: Math.sin(Math.PI / 3), symbol: 'sin(π/3)', exactForm: '√3/2' },
  { value: Math.sin(Math.PI / 2), symbol: 'sin(π/2)', exactForm: '1' },

  // cos values
  { value: Math.cos(0), symbol: 'cos(0)', exactForm: '1' },
  { value: Math.cos(Math.PI / 6), symbol: 'cos(π/6)', exactForm: '√3/2' },
  { value: Math.cos(Math.PI / 4), symbol: 'cos(π/4)', exactForm: '√2/2' },
  { value: Math.cos(Math.PI / 3), symbol: 'cos(π/3)', exactForm: '1/2' },
  { value: Math.cos(Math.PI / 2), symbol: 'cos(π/2)', exactForm: '0' },

  // tan values
  { value: Math.tan(Math.PI / 6), symbol: 'tan(π/6)', exactForm: '1/√3' },
  { value: Math.tan(Math.PI / 4), symbol: 'tan(π/4)', exactForm: '1' },
  { value: Math.tan(Math.PI / 3), symbol: 'tan(π/3)', exactForm: '√3' },
]