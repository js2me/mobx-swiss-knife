# `Stepper`

`Stepper` stores a position in a sequential flow: onboarding, checkout, or a setup wizard. The index is safely clamped to the array bounds, so “back” and “next” buttons do not require manual checks.

## Example: Checkout Wizard

```ts
import { createStepper } from "mobx-swiss-knife";

const stepper = createStepper({
  steps: ['Contacts', 'Delivery', 'Confirmation'],
});

function next() {
  if (stepper.isLastStep) return submitOrder();
  stepper.nextStep();
}

function back() {
  if (stepper.hasPrevStep) stepper.prevStep();
}

console.log(stepper.activeStepIndex, stepper.activeStep);
```

## Dynamic Steps

`steps` can be a function. This is useful when a step depends on the selected plan or a feature flag:

```ts
const stepper = createStepper({
  steps: () =>
    plan === 'business'
      ? ['Company', 'Members', 'Payment']
      : ['Profile', 'Payment'],
});
```

When the list changes, the current index is adjusted to the valid range.

## Properties

- `steps` — the current list of steps.
- `activeStepIndex` — the current step index, starting at `0`.
- `activeStep` — the current step value.
- `isNextStepLast` — whether the next step is the last one.
- `isLastStep` — whether the current step is the last one.
- `hasPrevStep` — whether a previous step exists.

## Methods

- `setSteps(steps)` — replace the list.
- `goToStep(index)` — go to an index.
- `nextStep()` / `prevStep()` — move forward or backward.
- `checkStepCompleted(index)` — check whether the index is completed (`index < activeStepIndex`).
- `addStep(step, position?)` — add a step at the end or at a position; duplicates are not added.
- `removeStep(step)` — remove a step by value.
