import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTicker, Ticker } from './model.js';
import type { TickerConfig } from './model.types.js';

describe('Ticker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct ticksPer value', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(1000);
      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });

    it('should initialize with abortSignal if provided', () => {
      const abortController = new AbortController();
      const config: TickerConfig = {
        ticksPer: 1000,
        abortSignal: abortController.signal,
      };
      const ticker = new Ticker(config);

      expect(ticker).toBeDefined();
    });

    it('should handle zero ticksPer value', () => {
      const config: TickerConfig = { ticksPer: 0 };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(0);
    });

    it('should handle negative ticksPer value', () => {
      const config: TickerConfig = { ticksPer: -100 };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(-100);
    });

    it('should set up mobx observables correctly', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.ticks).toBe(0);
      expect(ticker.ticksPer).toBe(1000);
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('createTicker factory function', () => {
    it('should create a new Ticker instance', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = createTicker(config);

      expect(ticker).toBeInstanceOf(Ticker);
      expect(ticker.ticksPer).toBe(1000);
    });
  });

  describe('start method', () => {
    it('should start ticking and set isRunning to true', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.isRunning).toBe(false);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should reset before starting', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.ticks = 5;
      expect(ticker.ticks).toBe(5);

      ticker.start();
      expect(ticker.ticks).toBe(0);
    });

    it('should handle zero ticksPer in start', () => {
      const config: TickerConfig = { ticksPer: 0 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle negative ticksPer in start', () => {
      const config: TickerConfig = { ticksPer: -100 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should not start if already running', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      const initialTicks = ticker.ticks;

      ticker.start();

      expect(ticker.isRunning).toBe(true);
      expect(ticker.ticks).toBe(initialTicks);
    });
  });

  describe('stop method', () => {
    it('should stop ticking and set isRunning to false', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.stop();
      expect(ticker.isRunning).toBe(false);
    });

    it('should handle stopping when not running', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(() => ticker.stop()).not.toThrow();
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('reset method', () => {
    it('should reset ticks to 0', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.ticks = 5;
      expect(ticker.ticks).toBe(5);

      ticker.reset();
      expect(ticker.ticks).toBe(0);
    });

    it('should stop ticking when resetting', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.reset();
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('destroy method', () => {
    it('should reset and abort the abort controller', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();

      // @ts-ignore
      const abortSpy = vi.spyOn(ticker.abortController, 'abort');

      ticker.destroy();

      expect(abortSpy).toHaveBeenCalled();
      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);
    });

    it('should clean up properly when destroyed', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();

      ticker.destroy();

      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);
    });
  });

  describe('reaction on ticksPer change', () => {
    it('should automatically start when ticksPer changes', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.isRunning).toBe(false);

      ticker.ticksPer = 2000;

      expect(ticker.isRunning).toBe(true);
    });

    it('should handle reaction with abort signal', () => {
      const abortController = new AbortController();
      const config: TickerConfig = {
        ticksPer: 1000,
        abortSignal: abortController.signal,
      };
      const ticker = new Ticker(config);

      ticker.ticksPer = 2000;

      expect(ticker.isRunning).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should work through complete lifecycle', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);
      expect(ticker.ticks).toBe(0);

      ticker.stop();
      expect(ticker.isRunning).toBe(false);

      ticker.reset();
      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.destroy();
      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);
    });

    it('should handle multiple start/stop cycles', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.isRunning).toBe(true);
      ticker.stop();
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);
      ticker.stop();
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);
      ticker.stop();
      expect(ticker.isRunning).toBe(false);

      expect(ticker.ticks).toBe(0);
    });

    it('should maintain state consistency', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.stop();
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.reset();
      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);

      ticker.destroy();
      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);
    });
  });

  describe('edge cases and error conditions', () => {
    it('should handle very large ticksPer values', () => {
      const config: TickerConfig = { ticksPer: Number.MAX_SAFE_INTEGER };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(Number.MAX_SAFE_INTEGER);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle very small ticksPer values', () => {
      const config: TickerConfig = { ticksPer: Number.MIN_SAFE_INTEGER };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(Number.MIN_SAFE_INTEGER);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle NaN ticksPer', () => {
      const config: TickerConfig = {
        ticksPer: Number.NaN as unknown as number,
      };
      const ticker = new Ticker(config);

      expect(Number.isNaN(ticker.ticksPer)).toBe(true);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle Infinity ticksPer', () => {
      const config: TickerConfig = { ticksPer: Infinity };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(Infinity);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle undefined ticksPer gracefully', () => {
      const config: TickerConfig = { ticksPer: undefined as unknown as number };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBeUndefined();
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle null ticksPer gracefully', () => {
      const config: TickerConfig = { ticksPer: null as unknown as number };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBeNull();
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle string ticksPer conversion', () => {
      const config: TickerConfig = { ticksPer: '1000' as unknown as number };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe('1000');
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });
  });

  describe('concurrent operations', () => {
    it('should handle rapid consecutive calls', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      ticker.stop();
      ticker.start();
      ticker.stop();
      ticker.start();
      ticker.stop();

      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);
    });

    it('should handle rapid reset calls', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.ticks = 5;

      ticker.reset();
      ticker.reset();
      ticker.reset();

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('state validation', () => {
    it('should validate initial state', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.ticks).toBe(0);
      expect(ticker.ticksPer).toBe(1000);
      expect(ticker.isRunning).toBe(false);
    });

    it('should validate state after start', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(true);
    });

    it('should validate state after stop', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      ticker.stop();
      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });

    it('should validate state after reset', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.ticks = 5;
      ticker.reset();
      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });

    it('should validate state after destroy', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      ticker.destroy();
      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('property access patterns', () => {
    it('should allow property access in different orders', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(ticker.ticks).toBe(0);
      expect(ticker.ticksPer).toBe(1000);
      expect(ticker.isRunning).toBe(false);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.stop();
      expect(ticker.isRunning).toBe(false);
    });

    it('should handle property reassignment', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.ticksPer = 2000;
      expect(ticker.ticksPer).toBe(2000);

      expect(ticker.isRunning).toBe(true);

      ticker.ticksPer = 500;
      expect(ticker.ticksPer).toBe(500);

      expect(ticker.isRunning).toBe(true);
    });

    it('should handle property assignment during operation', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      expect(ticker.isRunning).toBe(true);

      ticker.ticksPer = 2000;
      expect(ticker.ticksPer).toBe(2000);
      expect(ticker.isRunning).toBe(true);

      expect(ticker.ticks).toBe(0);
    });
  });

  describe('memory management', () => {
    it('should properly clean up resources on destroy', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();

      // @ts-ignore
      const abortSpy = vi.spyOn(ticker.abortController, 'abort');

      ticker.destroy();

      expect(abortSpy).toHaveBeenCalled();
      expect(ticker.isRunning).toBe(false);
      expect(ticker.ticks).toBe(0);
    });

    it('should not leak memory with multiple instances', () => {
      const config: TickerConfig = { ticksPer: 1000 };

      const tickers: Ticker[] = [];
      for (let i = 0; i < 10; i++) {
        tickers.push(new Ticker(config));
      }

      expect(tickers.length).toBe(10);
      tickers.forEach((ticker) => {
        expect(ticker.ticks).toBe(0);
        expect(ticker.isRunning).toBe(false);
      });

      tickers[0].destroy();

      expect(tickers[1].ticks).toBe(0);
      expect(tickers[1].isRunning).toBe(false);
    });
  });

  describe('performance characteristics', () => {
    it('should handle high-frequency operations efficiently', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      for (let i = 0; i < 1000; i++) {
        if (i % 100 === 0) {
          ticker.start();
          ticker.stop();
        }
      }

      expect(ticker.ticks).toBe(0);
    });

    it('should maintain performance with repeated resets', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      for (let i = 0; i < 100; i++) {
        ticker.reset();
      }

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should not throw errors with normal operations', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      expect(() => {
        ticker.start();
        ticker.stop();
        ticker.reset();
        ticker.destroy();
      }).not.toThrow();
    });

    it('should handle edge case of immediate destruction', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.destroy();

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });

    it('should handle multiple destructions gracefully', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.destroy();
      ticker.destroy();
      ticker.destroy();

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('complex integration scenarios', () => {
    it('should handle complex state transitions', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      ticker.stop();
      ticker.start();
      ticker.stop();
      ticker.reset();
      ticker.destroy();

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });

    it('should handle concurrent operations with timing', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      ticker.start();
      ticker.stop();
      ticker.start();
      ticker.stop();
      ticker.reset();
      ticker.destroy();

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });

    it('should maintain integrity through complex workflows', () => {
      const config: TickerConfig = { ticksPer: 1000 };
      const ticker = new Ticker(config);

      for (let cycle = 0; cycle < 5; cycle++) {
        ticker.start();
        ticker.stop();
        ticker.reset();
      }

      expect(ticker.ticks).toBe(0);
      expect(ticker.isRunning).toBe(false);
    });
  });

  describe('boundary condition tests', () => {
    it('should handle minimal valid values', () => {
      const config: TickerConfig = { ticksPer: 0 };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(0);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle maximum valid values', () => {
      const config: TickerConfig = { ticksPer: Number.MAX_VALUE };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(Number.MAX_VALUE);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle minimum valid values', () => {
      const config: TickerConfig = { ticksPer: Number.MIN_VALUE };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(Number.MIN_VALUE);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle very small positive values', () => {
      const config: TickerConfig = { ticksPer: 0.001 };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(0.001);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });

    it('should handle very large positive values', () => {
      const config: TickerConfig = { ticksPer: 1_000_000 };
      const ticker = new Ticker(config);

      expect(ticker.ticksPer).toBe(1_000_000);
      ticker.start();
      expect(ticker.isRunning).toBe(true);
    });
  });

  describe('behavioral consistency', () => {
    it('should behave consistently across multiple instantiations', () => {
      const config: TickerConfig = { ticksPer: 1000 };

      const ticker1 = new Ticker(config);
      const ticker2 = new Ticker(config);

      expect(ticker1.ticks).toBe(0);
      expect(ticker2.ticks).toBe(0);

      ticker1.start();
      ticker2.start();

      expect(ticker1.isRunning).toBe(true);
      expect(ticker2.isRunning).toBe(true);
    });

    it('should maintain consistent behavior with identical configurations', () => {
      const config1: TickerConfig = { ticksPer: 1000 };
      const config2: TickerConfig = { ticksPer: 1000 };

      const ticker1 = new Ticker(config1);
      const ticker2 = new Ticker(config2);

      expect(ticker1.ticksPer).toBe(ticker2.ticksPer);
      expect(ticker1.ticks).toBe(ticker2.ticks);

      ticker1.start();
      ticker2.start();

      expect(ticker1.isRunning).toBe(true);
      expect(ticker2.isRunning).toBe(true);
    });
  });
});
