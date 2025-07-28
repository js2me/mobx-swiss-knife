# `Stepper`   

Tool for step-by-step actions   

## Usage   

```ts
import { Stepper, createStepper } from "mobx-swiss-knife";

const stepper = new Stepper();
const stepper = createStepper()

stepper.nextStep();
stepper.prevStep();
stepper.isNextStepLast;
stepper.isLastStep;
stepper.hasPrevStep;
```