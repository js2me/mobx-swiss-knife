import { describe, expect, it } from 'vitest';

import { createStepper } from './model.js';

describe('stepper', () => {
  it('addStep should work', () => {
    const stepper = createStepper<string>({
      steps: [],
    });

    stepper.addStep('1');
    stepper.addStep('2');
    stepper.addStep('3');
    stepper.addStep('4');

    expect(stepper.steps).toEqual(['1', '2', '3', '4']);
  });

  it('setSteps should work', () => {
    const stepper = createStepper<string>({
      steps: ['initial'],
    });

    stepper.setSteps(['new', 'steps']);

    expect(stepper.steps).toEqual(['new', 'steps']);
  });

  it('goToStep should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3', '4'],
    });

    stepper.goToStep(2);
    expect(stepper.activeStepIndex).toBe(2);
    expect(stepper.activeStep).toBe('3');

    stepper.goToStep(-1);
    expect(stepper.activeStepIndex).toBe(0);

    stepper.goToStep(10);
    expect(stepper.activeStepIndex).toBe(3);
  });

  it('nextStep should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    stepper.nextStep();
    expect(stepper.activeStepIndex).toBe(1);
    expect(stepper.activeStep).toBe('2');

    stepper.nextStep();
    expect(stepper.activeStepIndex).toBe(2);
    expect(stepper.activeStep).toBe('3');

    stepper.nextStep();
    expect(stepper.activeStepIndex).toBe(2);
  });

  it('prevStep should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    stepper.goToStep(2);
    stepper.prevStep();
    expect(stepper.activeStepIndex).toBe(1);
    expect(stepper.activeStep).toBe('2');

    stepper.prevStep();
    expect(stepper.activeStepIndex).toBe(0);
    expect(stepper.activeStep).toBe('1');

    stepper.prevStep();
    expect(stepper.activeStepIndex).toBe(0);
  });

  it('checkStepCompleted should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    expect(stepper.checkStepCompleted(0)).toBe(false);
    expect(stepper.checkStepCompleted(1)).toBe(false);
    expect(stepper.checkStepCompleted(2)).toBe(false);

    stepper.goToStep(1);
    expect(stepper.checkStepCompleted(0)).toBe(true);
    expect(stepper.checkStepCompleted(1)).toBe(false);
    expect(stepper.checkStepCompleted(2)).toBe(false);

    stepper.goToStep(2);
    expect(stepper.checkStepCompleted(0)).toBe(true);
    expect(stepper.checkStepCompleted(1)).toBe(true);
    expect(stepper.checkStepCompleted(2)).toBe(false);
  });

  it('isNextStepLast should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    expect(stepper.isNextStepLast).toBe(false);

    stepper.goToStep(1);
    expect(stepper.isNextStepLast).toBe(true);

    stepper.goToStep(2);
    expect(stepper.isNextStepLast).toBe(false);
  });

  it('isLastStep should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    expect(stepper.isLastStep).toBe(false);

    stepper.goToStep(2);
    expect(stepper.isLastStep).toBe(true);
  });

  it('hasPrevStep should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    expect(stepper.hasPrevStep).toBe(false);

    stepper.goToStep(1);
    expect(stepper.hasPrevStep).toBe(true);

    stepper.goToStep(2);
    expect(stepper.hasPrevStep).toBe(true);
  });

  it('addStep should handle duplicates', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2'],
    });

    stepper.addStep('2');
    stepper.addStep('3');

    expect(stepper.steps).toEqual(['1', '2', '3']);
  });

  it('removeStep should work', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    stepper.removeStep('2');
    expect(stepper.steps).toEqual(['1', '3']);

    stepper.removeStep('non-existent');
    expect(stepper.steps).toEqual(['1', '3']);
  });

  it('should handle empty steps array', () => {
    const stepper = createStepper<string>({
      steps: [],
    });

    expect(stepper.steps).toEqual([]);
    expect(stepper.activeStepIndex).toBe(0);
    expect(stepper.activeStep).toBeUndefined();
    expect(stepper.isLastStep).toBe(false);
    expect(stepper.isNextStepLast).toBe(false);
    expect(stepper.hasPrevStep).toBe(false);
  });

  it('should handle single step', () => {
    const stepper = createStepper<string>({
      steps: ['only-step'],
    });

    expect(stepper.steps).toEqual(['only-step']);
    expect(stepper.activeStepIndex).toBe(0);
    expect(stepper.activeStep).toBe('only-step');
    expect(stepper.isLastStep).toBe(true);
    expect(stepper.isNextStepLast).toBe(false);
    expect(stepper.hasPrevStep).toBe(false);

    stepper.nextStep();
    expect(stepper.activeStepIndex).toBe(0);

    stepper.prevStep();
    expect(stepper.activeStepIndex).toBe(0);
  });

  it('should handle checkStepCompleted with empty steps', () => {
    const stepper = createStepper<string>({
      steps: [],
    });

    expect(stepper.checkStepCompleted(0)).toBe(false);
    expect(stepper.checkStepCompleted(-1)).toBe(true);
  });

  it('should handle checkStepCompleted with single step', () => {
    const stepper = createStepper<string>({
      steps: ['step1'],
    });

    expect(stepper.checkStepCompleted(0)).toBe(false);

    stepper.goToStep(0);
    expect(stepper.checkStepCompleted(0)).toBe(false);
  });

  it('should handle checkStepCompleted with multiple steps', () => {
    const stepper = createStepper<string>({
      steps: ['step1', 'step2', 'step3'],
    });

    expect(stepper.checkStepCompleted(0)).toBe(false);
    expect(stepper.checkStepCompleted(1)).toBe(false);
    expect(stepper.checkStepCompleted(2)).toBe(false);

    stepper.goToStep(1);
    expect(stepper.checkStepCompleted(0)).toBe(true);
    expect(stepper.checkStepCompleted(1)).toBe(false);
    expect(stepper.checkStepCompleted(2)).toBe(false);

    stepper.goToStep(2);
    expect(stepper.checkStepCompleted(0)).toBe(true);
    expect(stepper.checkStepCompleted(1)).toBe(true);
    expect(stepper.checkStepCompleted(2)).toBe(false);
  });

  it('should handle goToStep with boundary values', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    stepper.goToStep(-5);
    expect(stepper.activeStepIndex).toBe(0);

    stepper.goToStep(10);
    expect(stepper.activeStepIndex).toBe(2);

    stepper.goToStep(0);
    expect(stepper.activeStepIndex).toBe(0);
    stepper.goToStep(2);
    expect(stepper.activeStepIndex).toBe(2);
  });

  it('should handle addStep with empty steps', () => {
    const stepper = createStepper<string>({
      steps: [],
    });

    stepper.addStep('first');
    expect(stepper.steps).toEqual(['first']);
    expect(stepper.activeStepIndex).toBe(0);
  });

  it('should handle removeStep with empty steps', () => {
    const stepper = createStepper<string>({
      steps: [],
    });

    stepper.removeStep('non-existent');
    expect(stepper.steps).toEqual([]);
  });

  it('should handle removeStep with single step', () => {
    const stepper = createStepper<string>({
      steps: ['only-step'],
    });

    stepper.removeStep('only-step');
    expect(stepper.steps).toEqual([]);
    expect(stepper.activeStepIndex).toBe(0);
  });

  it('should handle removeStep with multiple steps', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3', '4'],
    });

    stepper.removeStep('2');
    expect(stepper.steps).toEqual(['1', '3', '4']);

    stepper.removeStep('1');
    expect(stepper.steps).toEqual(['3', '4']);

    stepper.removeStep('4');
    expect(stepper.steps).toEqual(['3']);
  });

  it('should handle setSteps with empty array', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2', '3'],
    });

    stepper.setSteps([]);
    expect(stepper.steps).toEqual([]);
    expect(stepper.activeStepIndex).toBe(0);
    expect(stepper.activeStep).toBeUndefined();
  });

  it('should handle setSteps with new steps', () => {
    const stepper = createStepper<string>({
      steps: ['1', '2'],
    });

    stepper.setSteps(['new', 'steps']);
    expect(stepper.steps).toEqual(['new', 'steps']);
    expect(stepper.activeStepIndex).toBe(0);
  });
});
