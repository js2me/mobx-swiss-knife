# `Ticker`

Creates regular ticks with a given interval and lets MobX react to them. It is useful for timers, simple animations, periodic UI refreshes, and any logic that needs a "run every N milliseconds" pattern.

## When to use

- When you need to refresh data in the UI on a schedule.
- When you want a simple tick counter without repeating timer logic in many places.
- When you need to start and stop periodic updates manually.

## What it can do

- Start and stop ticking.
- Store the number of elapsed ticks.
- Change the update interval.

## Usage example

```ts
import { createTicker } from "mobx-swiss-knife";

const ticker = createTicker({
  ticksPer: 1000,
});

ticker.start();

setTimeout(() => {
  console.log(ticker.ticks);
  ticker.stop();
}, 5000);
```
