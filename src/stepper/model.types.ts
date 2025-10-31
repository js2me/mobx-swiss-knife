import type { MaybeFn } from 'yummies/types';

export interface StepperConfig<StepData> {
  steps?: MaybeFn<StepData[]>;
  abortSignal?: AbortSignal;
}
