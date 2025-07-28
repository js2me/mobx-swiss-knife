# `Paginator`  

Tool for paginator components and data fetching. Helpful when you are using tables with pagination   

## Usage  

```ts
import { Paginator, createPaginator } from "mobx-swiss-knife";
import { reaction } from "mobx";

const paginator = new Paginator({
  pageSizes: [10, 20, 30]
});
const paginator = createPaginator({
  pageSizes: [10, 20, 30]
})

paginator.toPage(2);

paginator.toNextPage();
paginator.toNextPage();
paginator.toPreviousPage();
paginator.reset();
paginator.data;//
```