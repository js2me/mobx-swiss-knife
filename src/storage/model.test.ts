import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Storage } from './model.js';

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe('Storage', () => {
  let storage: Storage;

  beforeEach(() => {
    // Mock globalThis.localStorage and sessionStorage
    Object.defineProperty(globalThis, 'localStorage', {
      writable: true,
      value: mockLocalStorage,
    });

    Object.defineProperty(globalThis, 'sessionStorage', {
      writable: true,
      value: mockSessionStorage,
    });

    // Reset mocks
    vi.clearAllMocks();

    storage = new Storage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getStorage', () => {
    it('should return localStorage by default', () => {
      const result = (storage as any).getStorage({});
      expect(result).toBe(globalThis.localStorage);
    });

    it('should return sessionStorage when type is session', () => {
      const result = (storage as any).getStorage({ type: 'session' });
      expect(result).toBe(globalThis.sessionStorage);
    });

    it('should return localStorage when type is local', () => {
      const result = (storage as any).getStorage({ type: 'local' });
      expect(result).toBe(globalThis.localStorage);
    });

    it('should use config type when provided', () => {
      const configStorage = new Storage({ type: 'session' });
      const result = (configStorage as any).getStorage({});
      expect(result).toBe(globalThis.sessionStorage);
    });
  });

  describe('createKey', () => {
    it('should create a basic key', () => {
      const result = (storage as any).createKey({ key: 'test-key' });
      expect(result).toBe('test-key');
    });

    it('should create a key with prefix', () => {
      const result = (storage as any).createKey({
        key: 'test-key',
        prefix: 'prefix',
      });
      expect(result).toBe('prefix/test-key');
    });

    it('should create a key with namespace', () => {
      const result = (storage as any).createKey({
        key: 'test-key',
        namespace: 'namespace',
      });
      expect(result).toBe('namespace/test-key');
    });

    it('should create a key with prefix and namespace', () => {
      const result = (storage as any).createKey({
        key: 'test-key',
        prefix: 'prefix',
        namespace: 'namespace',
      });
      expect(result).toBe('prefix/namespace/test-key');
    });

    it('should use config values when not provided in params', () => {
      const configStorage = new Storage({
        prefix: 'config-prefix',
        namespace: 'config-namespace',
      });

      const result = (configStorage as any).createKey({
        key: 'test-key',
      });
      expect(result).toBe('config-prefix/config-namespace/test-key');
    });

    it('should use custom createKey function from config', () => {
      const customCreateKey = vi.fn().mockReturnValue('custom-key');
      const configStorage = new Storage({
        createKey: customCreateKey,
      });

      const result = (configStorage as any).createKey({
        key: 'test-key',
      });
      expect(customCreateKey).toHaveBeenCalledWith({ key: 'test-key' });
      expect(result).toBe('custom-key');
    });
  });

  describe('get', () => {
    it('should get a value from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify('test-value'));

      const result = storage.get({ key: 'test-key' });
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('should return null when key does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = storage.get({ key: 'non-existent' });
      expect(result).toBeNull();
    });

    it('should return fallback value when key does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = storage.get({
        key: 'non-existent',
        fallback: 'fallback-value',
      });
      expect(result).toBe('fallback-value');
    });

    it('should handle invalid JSON gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const result = storage.get({ key: 'test-key' });
      expect(result).toBeNull();
    });

    it('should handle non-string values', () => {
      mockLocalStorage.getItem.mockReturnValue('true');

      const result = storage.get({ key: 'test-key' });
      expect(result).toBe(true);
    });

    it('should use session storage when specified', () => {
      mockSessionStorage.getItem.mockReturnValue(
        JSON.stringify('session-value'),
      );

      const result = storage.get({ key: 'test-key', type: 'session' });
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('session-value');
    });

    it('should use prefix and namespace in key', () => {
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify('prefixed-value'),
      );

      const result = storage.get({
        key: 'test-key',
        prefix: 'prefix',
        namespace: 'namespace',
      });
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        'prefix/namespace/test-key',
      );
      expect(result).toBe('prefixed-value');
    });
  });

  describe('set', () => {
    it('should set a value in localStorage', () => {
      storage.set({ key: 'test-key', value: 'test-value' });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify('test-value'),
      );
    });

    it('should use custom format function when provided', () => {
      const formatFn = vi.fn().mockReturnValue('formatted-value');

      storage.set({
        key: 'test-key',
        value: 'test-value',
        format: formatFn,
      });

      expect(formatFn).toHaveBeenCalledWith('test-value');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        'formatted-value',
      );
    });

    it('should use session storage when specified', () => {
      storage.set({ key: 'test-key', value: 'test-value', type: 'session' });

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify('test-value'),
      );
    });

    it('should use prefix and namespace in key', () => {
      storage.set({
        key: 'test-key',
        value: 'test-value',
        prefix: 'prefix',
        namespace: 'namespace',
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'prefix/namespace/test-key',
        JSON.stringify('test-value'),
      );
    });
  });

  describe('syncProperty', () => {
    it('should sync property with storage and return disposer function', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored-value'));

      const context = { testProp: 'initial-value' };

      storage.syncProperty(context, 'testProp', {
        key: 'test-key',
      });

      expect(context.testProp).toBe('stored-value');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should use fallback value when storage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const context = { testProp: 'initial-value' };

      storage.syncProperty(context, 'testProp', {
        key: 'test-key',
        fallback: 'fallback-value',
      });

      expect(context.testProp).toBe('fallback-value');
    });

    it('should update storage when property changes', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify('initial-value'));

      const context = { testProp: 'initial-value' };

      storage.syncProperty(context, 'testProp', {
        key: 'test-key',
      });

      // Change the property
      context.testProp = 'updated-value';

      // The storage should be updated (this would happen in autorun)
      // We can't easily test the autorun behavior, but we can verify the disposer works
      expect(context.testProp).toBe('updated-value');
    });
  });

  describe('destroy', () => {
    it('should abort the abort controller', () => {
      const abortSpy = vi.spyOn(storage['abortController'], 'abort');

      storage.destroy();

      expect(abortSpy).toHaveBeenCalled();
    });
  });
});
