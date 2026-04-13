# `Paginator`

Manages pagination in the UI by storing the current page, page size, and helping move between pages. It is useful for tables, lists, catalogs, and any screen where data is displayed in chunks.

## When to use

- When you need to browse data page by page.
- When the user should be able to choose the page size.
- When you want to pass pagination parameters into data loading in a convenient way.

## What it can do

- Move to the next page, previous page, or a specific page.
- Change the page size.
- Keep the current pagination state in one place.

## Usage example

```ts
import { createPaginator } from "mobx-swiss-knife";

const paginator = createPaginator({
  page: 1,
  pageSize: 10,
  pagesCount: 12,
  pageSizes: [10, 20, 50],
});

paginator.toNextPage();
paginator.toPage(4);
paginator.setPageSize(20);

console.log(paginator.data);
console.log(paginator.toOffsetData());

paginator.reset();
```