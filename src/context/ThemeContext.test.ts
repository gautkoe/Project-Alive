import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { getInitialTheme } from './ThemeContext.js';

const STORAGE_KEY = 'pegase:theme-preference';

type MatchMediaOverrideWindow = Window & {
  matchMedia?: typeof window.matchMedia;
};

const createMockWindow = (): MatchMediaOverrideWindow => {
  const storage = new Map<string, string>();

  const localStorage = {
    clear: () => {
      storage.clear();
    },
    getItem: (key: string) => (storage.has(key) ? storage.get(key)! : null),
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string) => {
      storage.delete(key);
    },
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    get length() {
      return storage.size;
    },
  } satisfies Storage;

  return {
    localStorage,
  } as unknown as MatchMediaOverrideWindow;
};

describe('getInitialTheme', () => {
  let originalMatchMediaDescriptor: PropertyDescriptor | undefined;
  let originalWindowDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');

    const mockWindow = createMockWindow();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: mockWindow,
    });

    originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(mockWindow, 'matchMedia');
    mockWindow.localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    const mockWindow = (globalThis as unknown as { window?: MatchMediaOverrideWindow }).window;

    if (mockWindow) {
      if (originalMatchMediaDescriptor) {
        Object.defineProperty(mockWindow, 'matchMedia', originalMatchMediaDescriptor);
      } else {
        Reflect.deleteProperty(mockWindow, 'matchMedia');
      }
    }

    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
    } else {
      Reflect.deleteProperty(globalThis as Record<string, unknown>, 'window');
    }
  });

  it('returns light when matchMedia is unavailable', () => {
    const mockWindow = (globalThis as unknown as { window: MatchMediaOverrideWindow }).window;
    Object.defineProperty(mockWindow, 'matchMedia', {
      configurable: true,
      value: undefined,
    });

    assert.equal(getInitialTheme(), 'light');
  });
});
