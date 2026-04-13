# `Time`

Turns the current time into a reactive value. It is useful for clocks, "updated just now" indicators, relative time displays, and any UI that should refresh itself based on time.

## When to use

- When you need the current time as a reactive value.
- When the UI should refresh at a specific interval.
- When you want not only the raw date, but also a mapped value derived from it.

## What it can do

- Provide the current date and time in milliseconds.
- Refresh the value with a given interval.
- Return either the raw date or the result of your custom mapping.

## Usage example

```ts
import { createTime } from "mobx-swiss-knife";

const time = createTime({
  updatePer: 1000,
});

console.log(time.date);
console.log(time.ms);
console.log(time.value);
```

## Example with a mapped value

```ts
import { createTime } from "mobx-swiss-knife";

const seconds = createTime({
  map: (date) => date.getSeconds(),
});

console.log(seconds.value);
```
