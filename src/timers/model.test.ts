import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Timers } from './model.js';

describe('Timers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create and execute a throttled timer', () => {
    const timers = new Timers();
    const callback = vi.fn();

    timers.throttled(callback, 100);

    expect(callback).toHaveBeenCalled();
  });

  it('should destroy a timer properly', () => {
    const timers = new Timers();
    const callback = vi.fn();

    timers.throttled(callback, 100);

    timers.clean();

    expect(timers.isEmpty).toBe(true);
  });
});
