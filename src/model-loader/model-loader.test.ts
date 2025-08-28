import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from 'yummies/async';
import type { AnyObject } from 'yummies/utils/types';

import { createModelLoader, ModelLoader } from './model-loader.js';
import type { ModelLoaderOptions } from './model-loader.types.js';

describe('ModelLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      expect(loader).toBeInstanceOf(ModelLoader);
    });

    it('should initialize with abortSignal', () => {
      const abortController = new AbortController();
      const context = {};
      const options: ModelLoaderOptions<any> = {
        context,
        abortSignal: abortController.signal,
      };
      const loader = new ModelLoader(options);

      expect(loader).toBeInstanceOf(ModelLoader);
    });

    it('should set up mobx observables correctly', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      expect(loader).toHaveProperty('hasLoadingModels');
      expect(loader).toHaveProperty('hasErroredModels');
    });
  });

  describe('createModelLoader factory function', () => {
    it('should create a new ModelLoader instance', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = createModelLoader(options);

      expect(loader).toBeInstanceOf(ModelLoader);
    });
  });

  describe('storage getter', () => {
    it('should create storage when accessed for the first time', () => {
      const context = {} as AnyObject;
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      const storage = loader.storage;

      expect(storage).toBeDefined();
      expect(context[Symbol.for('[lazy-models]')]).toBeDefined();
    });

    it('should return existing storage when accessed multiple times', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      const storage1 = loader.storage;
      // @ts-ignore
      const storage2 = loader.storage;

      expect(storage1).toBe(storage2);
    });
  });

  describe('load method', () => {
    it('should load a model and store it in the context', async () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      const mockData = { name: 'test' };
      const mockFn = vi.fn().mockResolvedValue(mockData);

      const result = await loader.load('testKey', mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe(mockData);
    });

    it('should handle loading errors (throwOnError: false)', async () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      const mockError = new Error('Load failed');
      const mockFn = vi.fn().mockRejectedValue(mockError);

      await expect(loader.load('testKey', mockFn)).resolves.toBe(undefined);
    });

    it('should handle loading errors (throwOnError: true)', async () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context, throwOnError: true };
      const loader = new ModelLoader(options);

      const mockError = new Error('Load failed');
      const mockFn = vi.fn().mockRejectedValue(mockError);

      await expect(loader.load('testKey', mockFn)).rejects.toThrow(
        'Load failed',
      );
    });
  });

  describe('connect method', () => {
    it('should connect a model loader to a property', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      const mockFn = vi.fn().mockResolvedValue({ name: 'test' });

      const result = loader.connect({ property: 'testProp', fn: mockFn });

      expect(result).toBeNull();
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    it('should return the loaded model instance for a property', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      const mockData = { name: 'test' };
      // @ts-ignore
      vi.spyOn(loader.storage, 'get').mockReturnValue({
        data: mockData,
        fn: () => Promise.resolve(true),
        key: '',
      });

      const result = loader.get('testProp');

      expect(result).toBe(mockData);
    });

    it('should return null when no data is found', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'get').mockReturnValue(undefined);

      const result = loader.get('testProp');

      expect(result).toBeNull();
    });
  });

  describe('getError method', () => {
    it('should return the model load error for a property', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      const mockError = new Error('Load error');
      // @ts-ignore
      vi.spyOn(loader.storage, 'get').mockReturnValue({
        error: mockError,
        fn: () => Promise.resolve(true),
        key: '',
      });

      const result = loader.getError('testProp');

      expect(result).toBe(mockError);
    });

    it('should return null when no error is found', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'get').mockReturnValue({
        fn: () => Promise.resolve(true),
        key: '',
      });

      const result = loader.getError('testProp');

      expect(result).toBeNull();
    });
  });

  describe('isLoading method', () => {
    it('should check if the model for a property is currently loading', async () => {
      vi.useFakeTimers();

      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      loader.load('testProp', async () => {
        await sleep(1000);
        return true;
      });

      expect(loader.isLoading('testProp')).toBe(true);

      await vi.runAllTimersAsync();

      expect(loader.isLoading('testProp')).toBe(false);

      vi.useRealTimers();
    });

    it('should return true when model is loading (no data)', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'get').mockReturnValue({
        data: null,
        fn: () => Promise.resolve(true),
        key: '',
      });

      const result = loader.isLoading('testProp');

      expect(result).toBe(true);
    });
  });

  describe('hasLoadingModels getter', () => {
    it('should return true when there are loading models', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'values').mockReturnValue([
        { data: null },
      ] as any);

      const result = loader.hasLoadingModels;

      expect(result).toBe(true);
    });

    it('should return false when there are no loading models', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'values').mockReturnValue([
        { data: { name: 'test' } },
      ] as any);

      const result = loader.hasLoadingModels;

      expect(result).toBe(false);
    });
  });

  describe('hasErroredModels getter', () => {
    it('should return true when there are errored models', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'values').mockReturnValue([
        { error: new Error('Test error') },
      ] as any);

      const result = loader.hasErroredModels;

      expect(result).toBe(true);
    });

    it('should return false when there are no errored models', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      vi.spyOn(loader.storage, 'values').mockReturnValue([
        { data: { name: 'test' } },
      ] as any);

      const result = loader.hasErroredModels;

      expect(result).toBe(false);
    });
  });

  describe('destroy method', () => {
    it('should abort the abort controller', () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      // @ts-ignore
      const abortSpy = vi.spyOn(loader.abortController, 'abort');

      loader.destroy();

      expect(abortSpy).toHaveBeenCalled();
    });
  });

  describe('integration tests', () => {
    it('should work through complete lifecycle', async () => {
      const context = {};
      const options: ModelLoaderOptions<any> = { context };
      const loader = new ModelLoader(options);

      expect(loader).toBeInstanceOf(ModelLoader);
      expect(loader.hasLoadingModels).toBe(false);
      expect(loader.hasErroredModels).toBe(false);

      const mockData = { name: 'test' };
      const mockFn = vi.fn().mockResolvedValue(mockData);

      const result = await loader.load('testKey', mockFn);
      expect(result).toBe(mockData);

      const getData = loader.get('testKey');
      expect(getData).toStrictEqual(mockData);

      expect(loader.isLoading('testKey')).toBe(false);

      // @ts-ignore
      const abortSpy = vi.spyOn(loader.abortController, 'abort');
      loader.destroy();
      expect(abortSpy).toHaveBeenCalled();
    });
  });
});
