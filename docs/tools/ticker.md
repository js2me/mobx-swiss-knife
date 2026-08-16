# `Ticker`

`Ticker` is a reactive counter for periodic events. It does not execute a callback itself: a MobX model or component observes `ticks` and decides what to update.

## Example: Update a Status

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

After five seconds, the value will be approximately `5`. `start()` always begins a new cycle with a zero counter, so the old value does not continue after stopping.

## Properties

- `ticks` — the number of ticks since the last `start()` or `reset()`.
- `ticksPer` — the interval in milliseconds. It can be changed; the ticker restarts with the new interval.
- `isRunning` — whether the ticker is running.

## Methods

- `start()` — start counting from zero.
- `stop()` — stop while preserving `ticks`.
- `reset()` — stop and reset to zero.
- `destroy()` — clear the internal timer and lifecycle.
