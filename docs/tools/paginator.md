# `Paginator`

`Paginator` keeps pagination state separate from the request and UI. The component uses `data`, while the API can receive `toOffsetData()`, keeping the page-based state separate from the backend's offset/limit format.

## Example: Table with an Offset API

```ts
import { createPaginator } from "mobx-swiss-knife";

const paginator = createPaginator({
  page: 1,
  pageSize: 10,
  pagesCount: 12,
  pageSizes: [10, 20, 50],
});

async function loadUsers() {
  const response = await fetch(
    `/api/users?${new URLSearchParams(
      Object.fromEntries(
        Object.entries(paginator.toOffsetData()).map(([key, value]) => [
          key,
          String(value),
        ]),
      ),
    )}`,
  );
  return response.json();
}

await loadUsers();

paginator.toNextPage();
paginator.setPageSize(20); // page automatically returns to 1
console.log(paginator.inputData); // { page: 1, pageSize: 20 }

paginator.reset();
```

## Properties

- `pageSizes` — available page sizes; replace the array with `setPageSizes`.
- `inputData` — `{ page, pageSize }`, usually sent in the client request.
- `data` — `{ page, pageSize, pagesCount }`, used to render pagination.

The page is clamped to the `1..pagesCount` range: `toPage(0)` goes to the first page, while an oversized page goes to the last.

## Methods

- `toPreviousPage()`, `toNextPage()`, `toPage(page)` — navigation.
- `setPageSize(pageSize)` — change the size and reset the page to 1.
- `setPagesCount(pagesCount)` — update the page count after an API response.
- `setPageSizes(pageSizes)` — update the available sizes.
- `reset()` — go to the first page.
- `syncWith(getParameters)` — read `{ page, pageSize, pagesCount }` from external MobX state; the callback runs immediately and on changes.
- `createFromOffsetData({ offset, limit, count })` — get page-based data from an API response.
- `createOffsetData(data)` — convert the provided page-based object to `{ offset, limit, count }`.
- `toOffsetData()` — convert the current state.
- `destroy()` — disable the reaction created by `syncWith`.
