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

## Constructor parameters

- `pageSizes` — List of available page sizes.
- `page` — Initial page number.
- `pageSize` — Initial page size.
- `pagesCount` — Total number of pages.
- `abortSignal` — Stops internal sync reactions when the related lifecycle is aborted.

## Public properties

- `pageSizes` — Current list of available page sizes.
- `inputData` — Current page and page size.
- `data` — Current page, page size, and total pages.

## Public methods

- `toPreviousPage()` — Moves to the previous page.
- `toNextPage()` — Moves to the next page.
- `toPage(page)` — Moves to a specific page.
- `setPageSize(pageSize)` — Changes the page size and resets to page one.
- `setPagesCount(pagesCount)` — Updates the total number of pages.
- `setPageSizes(pageSizes)` — Replaces the list of page sizes.
- `reset()` — Resets the current page to the first page.
- `syncWith(getParametersFunction)` — Synchronizes paginator state with an external source.
- `createFromOffsetData(data)` — Builds page-based pagination data from offset-based values.
- `createOffsetData(data)` — Converts page-based pagination data into offset-based values.
- `toOffsetData()` — Converts the current paginator state into offset-based values.
- `destroy()` — Stops internal reactions.

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