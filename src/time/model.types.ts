import type { MaybeFn } from 'yummies/types';

export interface TimeConfig<TValue = Date> {
  abortSignal?: AbortSignal;
  /**
   * default - 1000
   */
  updatePer?: MaybeFn<number>;
  map?: (date: Date) => TValue;
}
