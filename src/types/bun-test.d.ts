declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;

  interface Matchers<R> {
    toBe(expected: unknown): R;
    toEqual(expected: unknown): R;
    toBeDefined(): R;
    toBeUndefined(): R;
    toBeNull(): R;
    toBeTruthy(): R;
    toBeFalsy(): R;
    toContain(expected: unknown): R;
    toHaveLength(expected: number): R;
    toThrow(expected?: unknown): R;
    toBeGreaterThan(expected: number): R;
    toBeLessThan(expected: number): R;
    toMatch(expected: RegExp | string): R;
    toMatchObject(expected: unknown): R;
  }

  interface ExpectInterface<T = unknown> {
    (value: T): {
      not: Matchers<void>;
    } & Matchers<void>;
    resolves: Matchers<Promise<void>>;
    rejects: Matchers<Promise<void>>;
  }

  export const expect: ExpectInterface;

  export function mock<T extends (...args: unknown[]) => unknown>(implementation?: T): jest.Mock<ReturnType<T>, Parameters<T>>;

  export function spyOn<T, K extends keyof T>(object: T, method: K): jest.SpyInstance;
  export function spyOn<T extends (...args: unknown[]) => unknown>(fn: T): jest.SpyInstance;
  export function spyOn<T>(object: T): jest.SpyInstance;

  export namespace mock {
    function module(moduleName: string, factory: () => unknown): void;
  }

  namespace jest {
    interface Mock<T = unknown, Y extends unknown[] = unknown[]> {
      (...args: Y): T;
      mock: {
        calls: Y[];
        instances: unknown[];
        invocationCallOrder: number[];
        results: unknown[];
      };
      mockClear(): void;
      mockReset(): void;
      mockRestore(): void;
      mockImplementation(fn: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
    }

    interface SpyInstance<T = unknown, Y extends unknown[] = unknown[]> extends Mock<T, Y> {
      mockRestore(): void;
    }
  }
}
