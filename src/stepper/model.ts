import {
  action,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';
import { callFunction } from 'yummies/common';

import type { StepperConfig } from './model.types.js';

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/stepper)
 */
export class Stepper<StepData> {
  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  activeStepIndex = 0;

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  steps: StepData[] = [];

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  get activeStep() {
    return this.steps[this.activeStepIndex];
  }

  constructor({ steps = [], abortSignal }: StepperConfig<StepData>) {
    this.steps = callFunction(steps);

    observable(this, 'activeStepIndex');
    observable(this, 'steps');
    action.bound(this, 'setSteps');
    action.bound(this, 'goToStep');
    action.bound(this, 'nextStep');
    action.bound(this, 'prevStep');
    action.bound(this, 'addStep');
    action.bound(this, 'removeStep');

    makeObservable(this);

    if (typeof steps === 'function') {
      reaction(steps, (steps) => runInAction(() => this.setSteps(steps)), {
        signal: abortSignal,
      });
    }
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  setSteps(steps: StepData[]) {
    this.steps = steps;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  goToStep(nextStepIndex: number) {
    this.activeStepIndex = Math.max(
      0,
      Math.min(nextStepIndex, this.steps.length - 1),
    );
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  nextStep() {
    this.goToStep(this.activeStepIndex + 1);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  prevStep() {
    this.goToStep(this.activeStepIndex - 1);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  checkStepCompleted(stepIndex: number) {
    return this.activeStepIndex > stepIndex;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  get isNextStepLast() {
    return this.steps.length - 1 === this.activeStepIndex + 1;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  get isLastStep() {
    return this.steps.length - 1 === this.activeStepIndex;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  get hasPrevStep() {
    return this.activeStepIndex !== 0;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  addStep(step: StepData, position?: number) {
    if (!this.steps.includes(step)) {
      if (position === undefined) {
        this.steps.push(step);
      } else {
        this.steps.splice(position, 0, step);
      }
    }
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/stepper) */
  removeStep(step: StepData) {
    this.steps = this.steps.filter((it) => it !== step);
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/stepper)
 */
export const createStepper = <StepData>(config: StepperConfig<StepData>) =>
  new Stepper(config);
