import { MaybeFn } from 'yummies/utils/types';

export interface StepperConfig<StepData> {
  steps?: MaybeFn<StepData[]>;
  abortSignal?: AbortSignal;
}
