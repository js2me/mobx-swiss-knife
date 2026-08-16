import { LinkedAbortController } from 'linked-abort-controller';
import { action, makeObservable, observable, reaction } from 'mobx';

import type { TickerConfig } from './model.types.js';

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/ticker)
 */
export class Ticker {
  private abortController: AbortController;
  private intervalId: ReturnType<typeof setInterval> | null;

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  ticks: number = 0;

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  ticksPer: number;

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  isRunning = false;

  constructor(config: TickerConfig) {
    this.abortController = new LinkedAbortController(config.abortSignal);

    this.ticksPer = config.ticksPer;
    this.intervalId = null;

    observable(this, 'ticks');
    observable(this, 'ticksPer');
    observable(this, 'isTicking');
    action.bound(this, 'tick');
    action.bound(this, 'start');
    action.bound(this, 'stop');
    action.bound(this, 'reset');

    makeObservable(this);

    reaction(() => this.ticksPer, this.start, {
      signal: this.abortController.signal,
    });
  }

  private tick() {
    this.ticks++;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  start() {
    this.reset();
    this.isRunning = true;
    this.intervalId = setInterval(this.tick, this.ticksPer);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  stop() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
    this.intervalId = null;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  reset() {
    this.stop();
    this.ticks = 0;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/ticker) */
  destroy() {
    this.reset();
    this.abortController.abort();
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/ticker)
 */
export const createTicker = (config: TickerConfig) => new Ticker(config);
