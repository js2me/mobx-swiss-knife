import { LinkedAbortController } from 'linked-abort-controller';
import { createAtom, type IAtom, reaction, runInAction } from 'mobx';
import { callFunction } from 'yummies/common';
import {
  annotation,
  applyObservable,
  type ObservableAnnotationsArray,
} from 'yummies/mobx';

import type { TimeConfig } from './model.types.js';

const annotations: ObservableAnnotationsArray<Time<any>> = [
  [annotation.computedStruct, 'value'],
  [annotation.observableRef, 'updatePer'],
];

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/time)
 */
export class Time<TValue = Date> {
  protected abortController: AbortController;
  protected atom: IAtom;
  protected updatePer: number;
  protected intervalId?: ReturnType<typeof setInterval>;

  constructor(protected config?: TimeConfig<TValue>) {
    this.abortController = new LinkedAbortController(config?.abortSignal);
    this.updatePer = callFunction(config?.updatePer ?? 1000);
    this.atom = createAtom(
      'timeAtom',
      () => this.startInterval(this.updatePer),
      () => this.stopInterval(),
    );

    applyObservable(this, annotations);

    if (typeof config?.updatePer === 'function') {
      reaction(
        config.updatePer,
        (updatePer) => {
          runInAction(() => {
            this.updatePer = updatePer;
          });
          if (this.intervalId != null) {
            this.stopInterval();
            this.startInterval(updatePer);
          }
        },
        {
          signal: this.abortController.signal,
        },
      );
    }
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/time) */
  get ms() {
    this.atom.reportObserved();
    return Date.now();
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/time) */
  get date() {
    return new Date(this.ms);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/time) */
  get value() {
    if (this.config?.map) {
      return this.config.map(this.date);
    }

    return this.date as TValue;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/time) */
  destroy() {
    this.abortController.abort();
    this.stopInterval();
  }

  protected stopInterval() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  protected startInterval(timeout: number) {
    runInAction(() => {
      this.updatePer = timeout;
    });
    this.intervalId = setInterval(() => this.atom.reportChanged(), timeout);
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/time)
 */
export const createTime = <TValue = Date>(config?: TimeConfig<TValue>) =>
  new Time(config);
