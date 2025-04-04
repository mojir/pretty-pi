
export type Config = {
  spaceSeparation: boolean
  precision: number
  epsilon: number
}

export const defaultConfig: Config = {
  spaceSeparation: false,
  precision: 8,
  epsilon: 1e-10,
} as const

export const CONFIG: Config = {
  spaceSeparation: false,
  precision: 8,
  epsilon: 1e-10,
}

export function setConfig(newConfig: Partial<Config>) {
  CONFIG.spaceSeparation = newConfig.spaceSeparation ?? defaultConfig.spaceSeparation
  CONFIG.precision = newConfig.precision ?? defaultConfig.precision
  CONFIG.epsilon = newConfig.epsilon ?? defaultConfig.epsilon
}

type Constant = {
  getSymbol: (noSpaceSeparation?: boolean) => string
  value: number
  getExactForm?: () => string
}

/**
 * Mathematical constants used for symbolic representation
 */
export const CONSTANTS: Constant[] = [
  { getSymbol: () => 'π', value: Math.PI },
  { getSymbol: () => 'e', value: Math.E },
  { getSymbol: () => 'φ', value: (1 + Math.sqrt(5)) / 2 },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(2)' : '√2', value: Math.sqrt(2) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(3)' : '√3', value: Math.sqrt(3) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(5)' : '√5', value: Math.sqrt(5) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(7)' : '√7', value: Math.sqrt(7) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(11)' : '√11', value: Math.sqrt(11) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(13)' : '√13', value: Math.sqrt(13) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(17)' : '√17', value: Math.sqrt(17) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(19)' : '√19', value: Math.sqrt(19) },
  { getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? '√(π)' : '√π', value: Math.sqrt(Math.PI) },
  { getSymbol: () => 'ln(2)', value: Math.LN2 },
  { getSymbol: () => 'ln(10)', value: Math.LN10 },
  { getSymbol: () => 'log₂(e)', value: Math.LOG2E },
  { getSymbol: () => 'log₁₀(e)', value: Math.LOG10E },
]

/**
 * Trigonometric values with their exact symbolic representations
 */
export const TRIG_VALUES: Constant[] = [
  // sin values
  { value: Math.sin(Math.PI / 6), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'sin(π / 6)' : 'sin(π/6)', getExactForm: () => CONFIG.spaceSeparation ? '1 / 2' : '1/2' },
  { value: Math.sin(Math.PI / 4), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'sin(π / 4)' : 'sin(π/4)', getExactForm: () => CONFIG.spaceSeparation ? '√2 / 2' : '√2/2' },
  { value: Math.sin(Math.PI / 3), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'sin(π / 3)' : 'sin(π/3)', getExactForm: () => CONFIG.spaceSeparation ? '√3 / 2' : '√3/2' },
  { value: Math.sin(Math.PI / 2), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'sin(π / 2)' : 'sin(π/2)', getExactForm: () => '1' },

  // cos values
  { value: Math.cos(0), getSymbol: () => 'cos(0)', getExactForm: () => '1' },
  { value: Math.cos(Math.PI / 6), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'cos(π / 6)' : 'cos(π/6)', getExactForm: () => CONFIG.spaceSeparation ? '√(3) / 2' : '√3/2' },
  { value: Math.cos(Math.PI / 4), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'cos(π / 4)' : 'cos(π/4)', getExactForm: () => CONFIG.spaceSeparation ? '√(2) / 2' : '√2/2' },
  { value: Math.cos(Math.PI / 3), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'cos(π / 3)' : 'cos(π/3)', getExactForm: () => CONFIG.spaceSeparation ? '1 / 2' : '1/2' },
  { value: Math.cos(Math.PI / 2), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'cos(π / 2)' : 'cos(π/2)', getExactForm: () => '0' },

  // tan values
  { value: Math.tan(Math.PI / 6), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'tan(π / 6)' : 'tan(π/6)', getExactForm: () => CONFIG.spaceSeparation ? '1 / √(3)' : '1/√3' },
  { value: Math.tan(Math.PI / 4), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'tan(π / 4)' : 'tan(π/4)', getExactForm: () => '1' },
  { value: Math.tan(Math.PI / 3), getSymbol: noSpaceSeparation => CONFIG.spaceSeparation && !noSpaceSeparation ? 'tan(π / 3)' : 'tan(π/3)', getExactForm: () => CONFIG.spaceSeparation ? '√(3)' : '√3' },
]
