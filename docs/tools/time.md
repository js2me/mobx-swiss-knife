# `Time`

`Time` provides the current time as a MobX-observable value. An important detail is that updates start when something observes `ms`, `date`, or `value`; there is no need to keep a timer for unused state.

## Example: “Updated Recently”

```ts
import { createTime } from "mobx-swiss-knife";

const time = createTime({
  updatePer: 1000,
});

const secondsAgo = (timestamp: number) =>
  Math.floor((time.ms - timestamp) / 1000);

console.log(new Date(time.ms));
console.log(secondsAgo(Date.now() - 15_000)); // approximately 15
```

## Example with a Mapped Value

```ts
import { createTime } from "mobx-swiss-knife";

const seconds = createTime({
  updatePer: 1000,
  map: (date) => date.toLocaleTimeString('ru-RU'),
});

console.log(seconds.value);
```

## Properties and Options

- `ms` — the current timestamp.
- `date` — a new `Date` for the current moment.
- `value` — the result of `map(date)`, or `Date` if mapping is not defined.
- `updatePer` — the update interval; can be a number or a function returning a number.
- `map(date)` — converts the current date to an application value.

## Method

- `destroy()` — stop updates and release the timer. Call it when destroying the model.
