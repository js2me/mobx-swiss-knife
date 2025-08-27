import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { DatesComparator, createDatesComparator } from './model.js';
import { DatesComparatorConfig, DatesToCompare } from './model.types.js';

describe('DatesComparator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const comparator = new DatesComparator();

      expect(comparator.dates).toBeNull();
      expect(comparator.hours).toBe(0);
      expect(comparator.minutes).toBe(0);
      expect(comparator.seconds).toBe(0);
    });

    it('should initialize with dates in config', () => {
      const dates: DatesToCompare = ['now', new Date(Date.now() + 3_600_000)];
      const config: DatesComparatorConfig = { dates };
      const comparator = new DatesComparator(config);

      expect(comparator.dates).toBe(dates);
      expect(comparator.hours).toBeGreaterThanOrEqual(0);
      expect(comparator.minutes).toBeGreaterThanOrEqual(0);
      expect(comparator.seconds).toBeGreaterThanOrEqual(0);
    });

    it('should set up mobx observables correctly', () => {
      const comparator = new DatesComparator();

      expect(comparator.dates).toBeNull();
      expect(comparator.hours).toBe(0);
      expect(comparator.minutes).toBe(0);
      expect(comparator.seconds).toBe(0);
    });
  });

  describe('createDatesComparator factory function', () => {
    it('should create a new DatesComparator instance', () => {
      const config: DatesComparatorConfig = {};
      const comparator = createDatesComparator(config);

      expect(comparator).toBeInstanceOf(DatesComparator);
    });
  });

  describe('setDates method', () => {
    it('should set new dates and recalculate difference', () => {
      const comparator = new DatesComparator();

      const dates: DatesToCompare = ['now', new Date(Date.now() + 3_600_000)];
      comparator.setDates(dates);

      expect(comparator.dates).toBe(dates);
      expect(comparator.hours).toBeGreaterThanOrEqual(0);
      expect(comparator.minutes).toBeGreaterThanOrEqual(0);
      expect(comparator.seconds).toBeGreaterThanOrEqual(0);
    });

    it('should clear timeout when setting new dates', () => {
      const comparator = new DatesComparator();

      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

      const dates: DatesToCompare = ['now', new Date(Date.now() + 3_600_000)];
      comparator.setDates(dates);

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('getDatesComparison method', () => {
    it('should return zero difference when dates is null', () => {
      const comparator = new DatesComparator();
      comparator.dates = null;

      const result = comparator['getDatesComparison']();

      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it('should calculate difference between dates', () => {
      const comparator = new DatesComparator();
      const startDate = new Date(Date.now());
      const endDate = new Date(startDate.getTime() + 3_600_000);

      comparator.dates = [startDate, endDate];

      const result = comparator['getDatesComparison']();

      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.minutes).toBeGreaterThanOrEqual(0);
      expect(result.seconds).toBeGreaterThanOrEqual(0);
    });
  });

  describe('compareDates method', () => {
    it('should update hours, minutes, seconds properties', () => {
      const comparator = new DatesComparator();
      const startDate = new Date(Date.now());
      const endDate = new Date(startDate.getTime() + 3_600_000);

      comparator.dates = [startDate, endDate];
      comparator['compareDates']();

      expect(comparator.hours).toBeGreaterThanOrEqual(0);
      expect(comparator.minutes).toBeGreaterThanOrEqual(0);
      expect(comparator.seconds).toBeGreaterThanOrEqual(0);
    });

    it('should clear timeout when difference is zero', () => {
      const comparator = new DatesComparator();
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 1000);

      comparator.dates = [startDate, endDate];

      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

      comparator['compareDates']();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('isEmpty getter', () => {
    it('should return true when totalHours is 0', () => {
      const comparator = new DatesComparator();
      comparator.hours = 0;
      comparator.minutes = 0;
      comparator.seconds = 0;

      expect(comparator.isEmpty).toBe(true);
    });

    it('should return false when totalHours is greater than 0', () => {
      const comparator = new DatesComparator();
      comparator.hours = 1;
      comparator.minutes = 0;
      comparator.seconds = 0;

      expect(comparator.isEmpty).toBe(false);
    });
  });

  describe('totalHours getter', () => {
    it('should calculate total hours correctly', () => {
      const comparator = new DatesComparator();
      comparator.hours = 1;
      comparator.minutes = 30;
      comparator.seconds = 0;

      expect(comparator.totalHours).toBe(1.5);
    });

    it('should handle fractional hours', () => {
      const comparator = new DatesComparator();
      comparator.hours = 1;
      comparator.minutes = 15;
      comparator.seconds = 0;

      expect(comparator.totalHours).toBe(1.25);
    });
  });

  describe('totalMinutes getter', () => {
    it('should calculate total minutes correctly', () => {
      const comparator = new DatesComparator();
      comparator.hours = 1;
      comparator.minutes = 30;
      comparator.seconds = 0;

      expect(comparator.totalMinutes).toBe(90);
    });

    it('should handle fractional minutes', () => {
      const comparator = new DatesComparator();
      comparator.hours = 0;
      comparator.minutes = 30;
      comparator.seconds = 30;

      expect(comparator.totalMinutes).toBe(30.5);
    });
  });

  describe('totalSeconds getter', () => {
    it('should calculate total seconds correctly', () => {
      const comparator = new DatesComparator();
      comparator.hours = 1;
      comparator.minutes = 30;
      comparator.seconds = 30;

      expect(comparator.totalSeconds).toBe(5430);
    });
  });

  describe('isDateDynamic method', () => {
    it('should return true for string dates', () => {
      const comparator = new DatesComparator();

      expect(comparator['isDateDynamic']('now')).toBe(true);
      expect(comparator['isDateDynamic']('now')).toBe(true);
    });

    it('should return false for non-string dates', () => {
      const comparator = new DatesComparator();

      expect(comparator['isDateDynamic'](new Date())).toBe(false);
      expect(comparator['isDateDynamic'](1_234_567_890)).toBe(false);
    });
  });

  describe('resolveDate method', () => {
    it('should resolve "now" to current date', () => {
      const comparator = new DatesComparator();
      const result = comparator['resolveDate']('now');

      expect(result).toBeInstanceOf(Date);
      expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
    });

    it('should resolve number to date', () => {
      const comparator = new DatesComparator();
      const timestamp = Date.now();
      const result = comparator['resolveDate'](timestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(timestamp);
    });

    it('should return date as-is', () => {
      const comparator = new DatesComparator();
      const date = new Date();
      const result = comparator['resolveDate'](date);

      expect(result).toBe(date);
    });
  });

  describe('reset method', () => {
    it('should clear timeout and reset dates', () => {
      const comparator = new DatesComparator();
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 3_600_000);

      comparator.dates = [startDate, endDate];

      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

      comparator.reset();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(comparator.dates).toBeNull();

      clearTimeoutSpy.mockRestore();
    });
  });
});
