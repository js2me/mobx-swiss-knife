# `Stepper`

Helps manage step-by-step flows in the UI. It works well for setup wizards, onboarding, checkout flows, and any process where the user moves through several screens in sequence.

## When to use

- When you need to store the current step and move between steps.
- When it is important to know whether there is a previous step or whether the current step is the last one.
- When the list of steps can change while the flow is running.

## What it can do

- Move forward and backward through steps.
- Jump to a specific step.
- Provide access to the current step and related state.

## Constructor parameters

- `steps` — Initial list of steps or a function that returns the current list.
- `abortSignal` — Stops internal syncing when dynamic steps are used.

## Public properties

- `activeStepIndex` — Index of the current step.
- `steps` — Current list of steps.
- `activeStep` — Current active step value.
- `isNextStepLast` — Shows whether the next step would be the last one.
- `isLastStep` — Shows whether the current step is the last one.
- `hasPrevStep` — Shows whether there is a previous step.

## Public methods

- `setSteps(steps)` — Replaces the current list of steps.
- `goToStep(index)` — Moves to a specific step index.
- `nextStep()` — Moves to the next step.
- `prevStep()` — Moves to the previous step.
- `checkStepCompleted(index)` — Shows whether a step is already completed.
- `addStep(step, position?)` — Adds a new step to the end or to a specific position.
- `removeStep(step)` — Removes a step by value.

## Usage example

```ts
import { createStepper } from "mobx-swiss-knife";

const stepper = createStepper({
  steps: ["Contacts", "Delivery", "Confirmation"],
});

console.log(stepper.activeStep);

stepper.nextStep();
stepper.goToStep(2);

console.log(stepper.isLastStep);
console.log(stepper.hasPrevStep);
```