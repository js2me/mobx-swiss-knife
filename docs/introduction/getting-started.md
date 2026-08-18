---
title: Getting started
---

# Getting started

`mobx-swiss-knife` is a collection of small MobX entities for state commonly repeated in applications: tabs, steps, pagination, timers, themes, and lazy loading.

## Installation

::: code-group

```bash [npm]
npm install @{packageJson.name}
```

```bash [yarn]
yarn add @{packageJson.name}
```

```bash [pnpm]
pnpm add @{packageJson.name}
```

:::


## Usage

```ts
import {
  createTabManager,
  createTicker,
  createTime,
} from 'mobx-swiss-knife';

const tabs = createTabManager({
  tabs: [
    { id: 'foo', label: 'Foo' },
    { id: 'bar', label: 'Bar' },
  ],
  fallbackTab: 'foo',
});

const time = createTime({ updatePer: 1000 });

console.log(tabs.activeTab, time.value);
```

## Choosing a Utility

- Need section selection: `TabManager`.
- Need a wizard or checkout flow: `Stepper`.
- Need `page`, `pageSize`, and conversion to `offset/limit`: `Paginator`.
- Need a countdown: `DatesComparator`; current time: `Time`.
- Need debounce/throttle: `Timers`; a periodic counter: `Ticker`.
- Need keyboard shortcuts: `KeyboardHandler`; WebSocket: `Socket`.
- Need a lazy model: `ModelLoader`.
- Need a theme or settings persistence: `TwoColorThemeStore` and `Storage`.

## Lifecycle

Most entities have `destroy()`. Call it when destroying the ViewModel or component if the instance is created manually. For reactions and timers, you can pass a shared `AbortSignal`:

```ts
const controller = new AbortController();
const time = createTime({ abortSignal: controller.signal });
const ticker = createTicker({ ticksPer: 1000, abortSignal: controller.signal });

controller.abort(); // stops both instances
```
