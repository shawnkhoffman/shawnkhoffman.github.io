# Vitest Testing Setup

This project uses Vitest for unit and integration tests. This document explains the testing setup and how to work with tests.

## Test Structure

Tests are organized by type in the following directories:

- `src/tests/components/` - Tests for Vue components
  - `common/` - Tests for common components
  - `layout/` - Tests for layout components
- `src/tests/views/` - Tests for views (pages)
  - `About/` - Tests for About page components
  - `AboutThisSite/` - Tests for AboutThisSite page components
- `src/tests/layouts/` - Tests for layout configurations

## Running Tests

### Run all tests

```bash
bun run test
```

### Run a specific test file

```bash
bun run test src/tests/components/common/ThemeController.test.ts
```

### Run tests with coverage

```bash
bun run test:coverage
```

### Run tests in watch mode

```bash
bun run test:watch
```

### Run tests with UI

```bash
bun run test:ui
```

## Testing Utilities

The testing setup includes several utilities:

- `src/tests/utils/test-utils.ts`: Vue Test Utils wrapper with router and theme support
- `src/tests/utils/test-utilities.ts`: General testing utilities for DOM operations
- `src/tests/utils/bun-test-utils.ts`: Additional test utilities
- `src/tests/setup.ts`: Setup for the jsdom testing environment

## Testing Practices

### Component Testing

1. **Test Structure**: Group tests using `describe` blocks for logical organization
2. **Naming Conventions**: Use descriptive test names that explain what is being tested
3. **Assertions**: Use clear assertions that make test failures easy to understand

Example:

```typescript
import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent', () => {
  describe('Rendering', () => {
    test('renders with required props', () => {
      const wrapper = mount(MyComponent, {
        props: { title: 'Test' },
      });
      expect(wrapper.text()).toContain('Test');
    });
  });

  describe('Interactions', () => {
    test('responds to user interactions', async () => {
      const wrapper = mount(MyComponent);
      await wrapper.find('button').trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      const wrapper = mount(MyComponent);
      const button = wrapper.find('button');
      expect(button.attributes('aria-label')).toBeDefined();
    });
  });
});
```

### Mocking

For mocking external dependencies or browser APIs:

```typescript
import { vi } from 'vitest';

const spy = vi.spyOn(console, 'error');
spy.mockImplementation(() => {});

// Test implementation

spy.mockRestore();
```

## CI Integration

The CI pipeline runs all tests as part of the GitHub Actions workflow. It:

1. Sets up Node.js/Bun environment
2. Caches dependencies for faster runs
3. Runs tests using the package.json `test` script
4. Generates and uploads test coverage reports
