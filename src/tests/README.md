# Bun Testing Setup

This project uses Bun's native test runner for unit and integration tests. This document explains the testing setup and how to work with tests.

## Test Structure

Tests are organized by type in the following directories:

- `src/tests/components/` - Tests for React components
  - `common/` - Tests for common components
  - `layout/` - Tests for layout components
- `src/tests/pages/` - Tests for pages
  - `About/` - Tests for About page components
  - `AboutThisSite/` - Tests for AboutThisSite page components
- `src/tests/layouts/` - Tests for layout configurations

## Running Tests

### Run all tests

```bash
bun test src/tests/**/*.test.tsx
```

### Run a specific test file

```bash
bun test src/tests/components/common/ThemeController.test.tsx
```

### Run tests with coverage

```bash
bun test --coverage src/tests/**/*.test.tsx
```

### Run tests in watch mode

```bash
bun test --watch src/tests/**/*.test.tsx
```

## Testing Utilities

The testing setup includes several utilities:

- `src/tests/utils/test-helpers.tsx`: Common test helpers and utilities
- `src/tests/setup/happy-dom.ts`: Setup for the Happy DOM testing environment

## Testing Practices

### Component Testing

1. **Test Structure**: Group tests using `describe` blocks for logical organization
2. **Naming Conventions**: Use descriptive test names that explain what is being tested
3. **Assertions**: Use clear assertions that make test failures easy to understand

Example:

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    test('renders with required props', () => {
      // Test implementation
    });
  });

  describe('Interactions', () => {
    test('responds to user interactions', () => {
      // Test implementation
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      // Test implementation
    });
  });
});
```

### Mocking

For mocking external dependencies or browser APIs:

```typescript
const spy = spyOn(console, 'error');
spy.mockImplementation(() => {});

// Test implementation

spy.mockRestore();
```

## CI Integration

The CI pipeline runs all tests as part of the GitHub Actions workflow. It:

1. Sets up Bun environment
2. Caches dependencies for faster runs
3. Runs tests using the package.json `test` script
4. Generates and uploads test coverage reports
