# `DatesComparator`  

Tool for comparing two dates, allows you to dynamically get the difference between two dynamic dates   

## Usage   

```ts
import { DatesComparator, createDatesComparator } from "mobx-swiss-knife";
import { reaction } from "mobx";

const dc = new DatesComparator();
const dc = createDatesComparator();

dc.setDates(['now', new Date('2025-07-28T07:53:30.285Z')]);
dc.totalHours; //
dc.minutes; //

reaction(() => dc.totalHours, (totalHours) => {
  console.log('total hours', totalHours);
})
```