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