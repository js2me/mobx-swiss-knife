import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createFakerLoader, FakerLoader } from './model.js';
import type { FakerLoaderConfig } from './model.types.js';

describe('FakerLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const loader = new FakerLoader();

      expect(loader).toBeInstanceOf(FakerLoader);
    });

    it('should initialize with config', () => {
      const config: FakerLoaderConfig = { defaultLocale: 'fr' };
      const loader = new FakerLoader(config);

      expect(loader).toBeInstanceOf(FakerLoader);
    });

    it('should create a model loader instance', () => {
      const loader = new FakerLoader();

      expect(loader).toHaveProperty('modelLoader');
    });
  });

  describe('createFakerLoader factory function', () => {
    it('should create a new FakerLoader instance', () => {
      const config: FakerLoaderConfig = {};
      const loader = createFakerLoader(config);

      expect(loader).toBeInstanceOf(FakerLoader);
    });
  });
});
