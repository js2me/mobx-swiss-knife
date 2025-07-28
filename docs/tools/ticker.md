# `Ticker`  

Tool for reactive ticks handling. Useful if you want to animate GUI updates like timers   

## Usage   

```ts
import { Ticker, createTicker } from "mobx-swiss-knife";

const ticker = new Ticker();
const ticker = createTicker();

ticker.start();
ticker.stop();
ticker.ticks;
```
