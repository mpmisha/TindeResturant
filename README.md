# Copilot bootstrap

A bootstrap project template for building modern React applications with TypeScript, Fluent UI v2, and GitHub Copilot integration.

## Overview

This is a foundational project setup that provides a structured development environment with best practices, comprehensive tooling, and GitHub Copilot integration for efficient development workflows.

## Tech Stack

- **React** with TypeScript for type-safe component development
- **Fluent UI v2** for consistent UI components
- **Recoil** for state management
- **SCSS Modules** for component-scoped styling
- **Webpack** for build system and bundling
- **Jest** and **React Testing Library** for testing
- **Storybook** for component development and visualization
- **ESLint** and **Prettier** for code quality and formatting

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook development server

## GitHub Copilot Integration

This project is optimized for GitHub Copilot development. See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for detailed guidelines on:

- Component development patterns
- State management with Recoil
- Testing best practices
- Styling conventions
- Project structure recommendations

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   └── feature/        # Feature-specific components
├── hooks/              # Custom React hooks
├── pages/              # Page-level components
├── services/           # API services and data fetching
├── state/              # Recoil atoms and selectors
├── styles/             # Global styles and SCSS variables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
└── __tests__/          # Global test utilities and setup
```

## Development Guidelines

### Component Development

- Use **Fluent UI v2** components from individual packages (e.g., `@fluentui/react-button`)
- Create components in dedicated folders within `src/components`
- Include test files (`*.test.tsx`) for every component
- Use SCSS modules for component-specific styling
- Follow PascalCase for component names and camelCase for props

### State Management

- Use **Recoil** for application state
- Create atoms and selectors in `src/state` files
- Follow clear naming conventions (`atomNameState`, `selectorNameValue`)
- Wrap tests in `RecoilRoot` when testing state-dependent components

### Testing

- Aim for 80%+ test coverage
- Use `@testing-library/react` for component testing
- Use `@testing-library/react-hooks` for custom hook testing
- Test user interactions, edge cases, and accessibility
- Place test files next to implementation files

### Styling

- Use SCSS modules for component-specific styles
- Define design tokens in SCSS variables
- Place global styles in `src/styles/` directory
- Follow camelCase naming for CSS modules

## Code Quality

- **TypeScript** strict mode enabled
- **ESLint** with React, TypeScript, and accessibility rules
- **Prettier** for consistent formatting
- **Husky** pre-commit hooks for linting and formatting

## Storybook

Use Storybook for component development and documentation:

```bash
npm run storybook
```

Create story files (`*.stories.tsx`) next to component files for visual testing and documentation.

## Contributing

1. Follow the development guidelines in [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
2. Ensure all tests pass and maintain high coverage
3. Use conventional commit messages
4. Create descriptive branch names (e.g., `feature/user-authentication`)

## License

This project is a personal bootstrap template for development purposes.
