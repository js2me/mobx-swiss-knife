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

## Constructor parameters

- `dates` — Initial pair of dates to compare.
- `checkTime` — Update interval in milliseconds when one of the dates is dynamic, such as `"now"`.
- `getComparison` — Custom comparison logic if you want to override the default time difference behavior.
- `abortSignal` — Clears the state when the related lifecycle is aborted.

## Public properties

- `dates` — Current pair of dates or `null`.
- `hours` — Current difference in hours.
- `minutes` — Current difference in minutes.
- `seconds` — Current difference in seconds.
- `isEmpty` — Shows whether there is no active comparison.
- `totalHours` — Total difference expressed in hours.
- `totalMinutes` — Total difference expressed in minutes.
- `totalSeconds` — Total difference expressed in seconds.

## Public methods

- `setDates(dates)` — Sets a new pair of dates and recalculates the difference.
- `reset()` — Clears the current comparison state.

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