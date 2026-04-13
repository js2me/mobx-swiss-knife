# `DatesComparator`

Helps compare two dates and get the difference between them in a UI-friendly format. It is useful for timers, countdowns, and any scenario where you need to show how much time is left until an event.

## When to use

- When you need to show a countdown to a date or time.
- When you need to quickly refresh the visible difference between "now" and a target date.
- When you want to replace the current dates or reset the state completely.

## What it provides

- The difference in hours, minutes, and seconds.
- The total duration in a larger aggregated format.
- A flag showing that no comparison is currently set.

## Usage example

```ts
import { createDatesComparator } from "mobx-swiss-knife";

const saleTimer = createDatesComparator({
  dates: ["now", new Date("2026-12-31T23:59:59.000Z")],
});

console.log(saleTimer.hours, saleTimer.minutes, saleTimer.seconds);

saleTimer.setDates(["now", new Date("2027-01-01T12:00:00.000Z")]);

console.log(saleTimer.totalHours);

saleTimer.reset();
```