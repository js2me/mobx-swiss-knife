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
  activeStepIndex = 0;

  steps: StepData[] = [];

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

  setSteps(steps: StepData[]) {
    this.steps = steps;
  }

  goToStep(nextStepIndex: number) {
    this.activeStepIndex = Math.max(
      0,
      Math.min(nextStepIndex, this.steps.length - 1),
    );
  }

  nextStep() {
    this.goToStep(this.activeStepIndex + 1);
  }

  prevStep() {
    this.goToStep(this.activeStepIndex - 1);
  }

  checkStepCompleted(stepIndex: number) {
    return this.activeStepIndex > stepIndex;
  }

  get isNextStepLast() {
    return this.steps.length - 1 === this.activeStepIndex + 1;
  }

  get isLastStep() {
    return this.steps.length - 1 === this.activeStepIndex;
  }

  get hasPrevStep() {
    return this.activeStepIndex !== 0;
  }

  addStep(step: StepData) {
    if (!this.steps.includes(step)) {
      this.steps.push(step);
    }
  }

  removeStep(step: StepData) {
    this.steps = this.steps.filter((it) => it !== step);
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/stepper)
 */
export const createStepper = <StepData>(config: StepperConfig<StepData>) =>
  new Stepper(config);
