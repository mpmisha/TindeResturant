# Custom instructions for Copilot - Personal Project

This document outlines guidelines and best practices for developing within this personal project using GitHub Copilot.

# Development Guidelines

## Component Usage

- **Prioritize Fluent UI v2:** Use components from individual `@fluentui/react-*` packages (e.g., `@fluentui/react-button`, `@fluentui/react-input`) for consistent UI components.
- **Fallback to Standard React:** For custom components not available in Fluent UI, build using standard React patterns with proper TypeScript typing.
- **Avoid global packages:** Prefer specific component packages over monolithic UI libraries for better tree-shaking and bundle optimization.

## Component Structure

- **Folder:** Place each new component in its own dedicated folder within `src/components` (e.g., `src/components/MyNewComponent/`).
- **Files:** Inside the component folder, include:
  - The component file: `MyNewComponent.tsx`
  - A test file: `MyNewComponent.test.tsx`
  - A SCSS module file: `MyNewComponent.module.scss`
  - A Storybook file (optional but recommended): `MyNewComponent.stories.tsx`
  - **Caution** Only create what you need. If you don't need a SCSS or storybook file, don't create them.
  - **Caution** Do not create `index.ts` files unless they serve a clear purpose for component exports.
  - **Caution** Always create a test file. Make sure to create a test file for every component you create. This is important for maintaining code quality and ensuring that your components work as expected.
- **Naming:** Use PascalCase for component names and camelCase for props. For example, `MyNewComponent` for the component and `myProp` for a prop.

## State Management (Recoil)

- **Atoms/Selectors:** Create new atoms or selectors in the relevant `src/state` files (e.g., `appState.ts`, `userState.ts`).
- **Naming:** Use clear naming conventions (e.g., `atomNameState`, `selectorNameValue`).
- **Testing:** When testing hooks or components that use Recoil state, ensure tests are wrapped in a `RecoilRoot` provider, often via a custom test wrapper.
- **File Organization:** Group related atoms and selectors in the same file, and export them clearly.

## Package Management

- **Adding Packages:** Use `npm install <package-name>` or `yarn add <package-name>` to add new dependencies.
- **Type Definitions:** Always install TypeScript definitions for packages when available (`@types/*`).
- **Dependency Management:** Keep dependencies up-to-date and regularly audit for security vulnerabilities using `npm audit`.

## Styling (SCSS)

- **SCSS Modules:** Use SCSS Modules (`*.module.scss`) for component-specific styles to ensure proper encapsulation. Place them alongside the component file.
- **Naming Conventions:** Follow consistent naming conventions for CSS classes (prefer camelCase for CSS modules).
- **Global Styles:** Place global styles in `src/styles/` directory with clear organization (e.g., `variables.scss`, `mixins.scss`, `global.scss`).
- **Design Tokens:** Define design tokens (colors, spacing, typography) in SCSS variables for consistency across the application.

## Build System (Webpack)

- **Configuration:** Maintain webpack configuration files in the project root or `config/` directory.
- **Environment-specific builds:** Support development, production, and testing environments with appropriate optimizations.
- **Asset Management:** Configure proper handling for images, fonts, and other static assets.
- **Code Splitting:** Implement code splitting for optimal bundle sizes and loading performance.

# Testing Guidelines

## General Principles

- **File Placement:** Place test files next to the implementation files (`ComponentName.test.tsx`, `hookName.test.ts`) within the component's folder.
- **Coverage:** Aim for high test coverage (80%+ line and branch coverage). Test every exported item, conditional branch, and edge case.
- **Structure:** Organize tests in nested `describe` blocks (outer for component/hook name, inner for functionality). Use clear `it` statements.

## Running Tests

- Run all tests with coverage: `npm run test` or `npm run test:coverage`
- Run tests in watch mode: `npm run test:watch`
- Run a specific test file: `npm run test ComponentName.test.tsx`
- Run a specific test within a file: `npm run test ComponentName.test.tsx -t "Test description"`

## Test Implementation Details

### Component Tests

- Use `@testing-library/react` for component testing.
- Test basic rendering, user interactions (clicking, typing, etc.), edge cases, and error states.
- Use `screen` queries for accessibility-focused testing.
- Mock external dependencies and API calls appropriately.

### Hook Tests

- Use `@testing-library/react-hooks` for testing custom hooks.
- Provide a `wrapper` with `RecoilRoot` for state management if needed.
- Test initial state values and state updates using `act`.

### Mocking

- Define Jest mocks at the top using `jest.mock()`.
- Mock implementation details while preserving the API.
- Reset mocks in `beforeEach` or `afterEach`.
- Create mock versions for complex components if necessary.
  Example:
  ```javascript
  jest.mock("../UserProfile/UserProfile", () => ({
    UserProfile: ({ user, onEdit }) => (
      <div data-testid="user-profile">
        <span>{user.name}</span>
        <button data-testid="edit-button" onClick={() => onEdit(user)}>
          Edit
        </button>
      </div>
    ),
  }));
  ```

### Test Data

- Create dummy test data at the beginning of the test suite or in separate test utility files.
- Include all required properties. Use proper TypeScript typing for test data.
- Test with complete and incomplete data scenarios.

### Testing User Interactions

- Use `userEvent` from `@testing-library/user-event` for more realistic user interactions.
- Use `fireEvent` for direct event testing when needed.
- Verify expected state changes and function calls using appropriate assertions.

### Testing Edge Cases

- Test with empty arrays, invalid/incomplete data, `null`, and `undefined` inputs where applicable.
- Test loading states, error states, and network failure scenarios.
- Test responsive behavior and different viewport sizes when relevant.

### Testing Accessibility

- Include accessibility testing using `@testing-library/jest-dom` matchers.
- Use proper ARIA roles for querying elements.
- Test keyboard navigation and screen reader compatibility.

### Testing Recoil State

- Use a custom wrapper with `RecoilRoot` for components that use Recoil state.
- Test state updates triggered by user actions or hook calls.
- Mock selectors when testing isolated components.

### Setup and Cleanup

- Use `beforeEach`/`afterEach` for resetting mocks and state.
- Use `beforeAll`/`afterAll` for suite-level setup/teardown.
- Clean up event listeners, timers, and subscriptions in cleanup functions.

# Code Quality and Formatting

- **ESLint:** Configure ESLint with React, TypeScript, and accessibility rules. Run `npm run lint`.
- **Prettier:** Use Prettier for consistent code formatting. Configure with project-specific rules.
- **Husky:** Set up pre-commit hooks for linting and formatting.
- **TypeScript:** Use strict TypeScript configuration with proper type checking.

## Storybook (Component Visualization)

- **Purpose:** Use Storybook to develop and visualize components in isolation.
- **File Creation:** Create story files named `ComponentName.stories.tsx` next to the component file.
- **Structure:**

  - Import necessary modules (`React`, `@storybook/react`, the component itself).
  - Define `meta` information (title, component, parameters).
  - Provide context providers (Recoil, themes) in decorators when needed.
  - Export individual stories as `StoryObj<ComponentProps>`.
  - Example Structure:

    ```typescript
    import React from "react";
    import { Meta, StoryObj } from "@storybook/react";
    import { RecoilRoot } from "recoil";
    import { MyComponent, MyComponentProps } from "./MyComponent";

    const meta: Meta<MyComponentProps> = {
      title: "Components/MyComponent",
      component: MyComponent,
      parameters: {
        layout: "centered",
      },
      decorators: [
        (Story) => (
          <RecoilRoot>
            <Story />
          </RecoilRoot>
        ),
      ],
    };

    export default meta;

    type Story = StoryObj<MyComponentProps>;

    export const Default: Story = {
      args: {
        title: "Default Title",
        isLoading: false,
      },
    };

    export const Loading: Story = {
      args: {
        title: "Loading Title",
        isLoading: true,
      },
    };
    ```

- **Running Storybook:** Use the command `npm run storybook` to start the local Storybook server.

# Project Structure

## Recommended Directory Structure

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

## Environment Configuration

- **Environment Variables:** Use `.env` files for environment-specific configuration.
- **Type Safety:** Create TypeScript definitions for environment variables.
- **Build Optimization:** Configure different builds for development and production environments.

# Performance Guidelines

- **Code Splitting:** Implement route-based and component-based code splitting.
- **Lazy Loading:** Use React.lazy for components that are not immediately needed.
- **Memoization:** Use React.memo, useMemo, and useCallback appropriately to prevent unnecessary re-renders.
- **Bundle Analysis:** Regularly analyze bundle size and optimize imports.

# Git and Development Workflow

- **Commit Messages:** Use conventional commit messages for better changelog generation.
- **Branch Naming:** Use descriptive branch names (e.g., `feature/user-authentication`, `fix/login-bug`).
- **Pull Requests:** Include proper descriptions, test coverage, and review requirements.
- **CI/CD:** Set up continuous integration for testing, linting, and building.
