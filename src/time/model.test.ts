import { reaction } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { sleep } from 'yummies/async';

import { createTime } from './model.js';

describe('time', () => {
  it('works only if has observers', async () => {
    vi.useFakeTimers();

    const spy = vi.fn();
    const time = createTime({
      updatePer: 100,
    });

    // biome-ignore lint/nursery/noFloatingPromises: <explanation>
    sleep(400);

    await vi.runAllTimersAsync();

    expect(spy).toHaveBeenCalledTimes(0);

    const dispose = reaction(
      () => time.ms,
      (ms) => spy(ms),
    );

    setTimeout(() => dispose(), 1000);

    await vi.runAllTimersAsync();

    expect(time.value).toBeInstanceOf(Date);
    expect(spy).toHaveBeenCalledTimes(10);
  });
});
