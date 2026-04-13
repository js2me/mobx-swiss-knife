# `FakerLoader`

Loads `faker` only when it is actually needed. This is useful for demo data, mocks, and development screens where you do not want to load the data generator in advance.

## When to use

- When you need to generate test or demo data on demand.
- When you want to delay loading `faker` until the first real use.
- When you need to switch the generator locale for a specific scenario.

## What it provides

- Controlled loading of a `faker` instance.
- Loading state and error state if something goes wrong.
- Access to the ready-to-use instance after a successful load.

## Constructor parameters

- `defaultLocale` — Initial locale that will be used for loading `faker`.
- `abortSignal` — Stops the internal loading flow when the related lifecycle is aborted.

## Public properties

- `instance` — The currently loaded `faker` instance for the active locale.
- `isLoading` — Shows whether the current locale is still loading.
- `error` — Returns the last loading error for the current locale.

## Public methods

- `load(locale?)` — Loads `faker` for the provided locale or for the current default locale.
- `destroy()` — Cleans up the internal loader.

## Usage example

```ts
import { createFakerLoader } from "mobx-swiss-knife";

const fakerLoader = createFakerLoader({
  defaultLocale: "en",
});

await fakerLoader.load();

const city = fakerLoader.instance.location.city();
const email = fakerLoader.instance.internet.email();

console.log(city, email);
```