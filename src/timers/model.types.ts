import type { debounce, throttle } from 'lodash-es';
import type { PartialKeys } from 'yummies/types';

export interface TimerConfig {
  id: string;
  timeout: number;
  type: 'debounce' | 'throttle';
  leading?: boolean;
  trailing?: boolean;
  fn: TimedCallback;
  timedFn: ReturnType<typeof throttle | typeof debounce> | null;
}

export type TimerConfigRaw =
  | TimerConfig['timeout']
  | Partial<PartialKeys<TimerConfig, 'type'>>;

export type TimedCallback = (params: { runAgain: VoidFunction }) => void;

export interface TimersConfig {
  abortSignal?: AbortSignal;
}
