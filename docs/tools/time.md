# `Time`  

Tool for working with `Date` as reactive value   

## Usage   

```ts
import { Time, createTime } from "mobx-swiss-knife";

const time = new Time({
  updatePer: 1000, // default 1000
});
const time = createTime();

time.date;
time.ms;
time.value;
```

Example with mapping value:   

```ts

const time = new Time({
  map: date => date.getSeconds(),
});

time.value; // seconds
```
