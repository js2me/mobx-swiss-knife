# `Timers`

`Timers` combines debounce/throttle and keeps them in one managed lifecycle. This is more useful than scattered `setTimeout` calls when a screen needs to cancel all deferred actions with one call.

## Example: Search After an Input Pause

```ts
import { createTimers } from "mobx-swiss-knife";

const timers = createTimers();

const saveDraft = (text: string) => {
  timers.debounced(() => {
    console.log('Save draft:', text);
  }, { id: 'draft', timeout: 400 });
};

saveDraft("hello");
saveDraft("hello world");

console.log(timers.isEmpty);
```

The same `id` refers to the same timer: a new call updates the callback and restarts the debounce. Therefore, only the latest text is saved here.

## Example: Throttle and `runAgain`

```ts
import { createTimers } from "mobx-swiss-knife";

const timers = createTimers();

timers.throttled(() => {
  console.log('Update position');
}, { id: 'position', timeout: 300 });
```

The callback receives `{ runAgain }`. Calling `runAgain()` keeps the timer registered and schedules the next run:

```ts
timers.debounced(({ runAgain }) => {
  syncWithServer();
  if (shouldContinue) runAgain();
}, { id: 'sync', timeout: 1000 });
```

## Properties and Methods

- `isEmpty` — whether there are no active timers.
- `debounced(fn, timeout)` — short form with a numeric timeout.
- `debounced(fn, { id, timeout, leading, trailing })` — full debounce configuration.
- `throttled(fn, timeout | config)` — limit the execution frequency.
- `destroyTimer(id)` — cancel one timer by id.
- `clean()` — cancel all timers.
- `abortSignal` in the configuration — automatically clean up on abort.
