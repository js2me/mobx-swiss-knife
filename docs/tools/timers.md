# `Timers`

Simplifies working with delayed actions when a function should not run immediately, but should wait a little or be rate-limited. It is useful for search, autosave, input handling, and other user-driven scenarios.

## When to use

- When you need to delay an action until the user stops typing.
- When you need to limit how often repeated calls are executed.
- When you want a central way to clear active timers.

## What it can do

- Run delayed actions.
- Work in debounce and throttle modes.
- Clear a single timer or all timers at once.

## Usage example

```ts
import { createTimers } from "mobx-swiss-knife";

const timers = createTimers();

const saveDraft = (text: string) => {
  timers.debounced(() => {
    console.log("Save draft:", text);
  }, 400);
};

saveDraft("hello");
saveDraft("hello world");

console.log(timers.isEmpty);
```

## Example with rate limiting

```ts
import { createTimers } from "mobx-swiss-knife";

const timers = createTimers();

timers.throttled(() => {
  console.log("Update position");
}, 300);
```
