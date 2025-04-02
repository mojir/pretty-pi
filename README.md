# PrettyPi

A TypeScript library for converting numbers to their symbolic mathematical representations.

## Features

- Identifies common mathematical constants (π, e, φ, etc.)
- Recognizes and formats square roots, cube roots, and other radicals
- Handles fractions with appropriate simplification
- Converts decimal approximations of trigonometric values to their exact forms
- Performs algebraic simplifications (e.g., 12·cos(π/6) → 6·√3)
- Uses a flexible expression tree for robust representation

## Installation

```bash
npm install pretty-pi
```

## Usage

```typescript
import { printSymbolically } from 'pretty-pi';

console.log(printSymbolically(Math.PI));                // "π"
console.log(printSymbolically(Math.E));                 // "e"
console.log(printSymbolically(0.5));                    // "1/2"
console.log(printSymbolically(Math.sqrt(2)));           // "√2"
console.log(printSymbolically(2 * Math.PI));            // "2·π"
console.log(printSymbolically(Math.PI / 2));            // "π/2"
console.log(printSymbolically(Math.sin(Math.PI / 4)));  // "√2/2"
console.log(printSymbolically(Math.PI ** 2));           // "π²"
console.log(printSymbolically(Math.E * Math.PI));       // "e·π"
console.log(printSymbolically(12 * Math.cos(Math.PI / 6))); // "6·√3"
```

## How It Works

The library uses an expression tree representation to model mathematical expressions, which enables sophisticated simplification logic and consistent formatting. The main components include:

- **Expression Nodes**: A hierarchy of node types representing different mathematical constructs (numbers, constants, operations)
- **Parser**: Converts numeric values to expression trees
- **Simplification**: Applies mathematical rules to produce the cleanest representation possible

## Supported Representations

- Basic constants: π, e, φ (golden ratio)
- Fractions: 1/2, 3/4, etc.
- Powers: π², e³
- Square roots: √2, √3, etc.
- Cube roots: ∛2, ∛3, etc.
- Combinations: 2·π, π/4, π+1, etc.
- Trigonometric values: sin(π/4) → √2/2, cos(π/3) → 1/2, etc.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build
```

## License

MIT