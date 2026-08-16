# `FakerLoader`

`FakerLoader` lazy-loads `@faker-js/faker`. This is useful for demo data and mocks: the heavy locale is not included in the application's initial load, and the component exposes loading state as a regular MobX property.

## Example: Generate Data on Demand

```ts
import { createFakerLoader } from "mobx-swiss-knife";

const fakerLoader = createFakerLoader({ defaultLocale: 'en' });

async function createDemoUsers() {
  if (!fakerLoader.instance) {
    await fakerLoader.load();
  }

  return Array.from({ length: 3 }, () => ({
    name: fakerLoader.instance.person.fullName(),
    email: fakerLoader.instance.internet.email(),
  }));
}

console.log(await createDemoUsers());
```

## Changing the Locale

```ts
await fakerLoader.load('de');
console.log(fakerLoader.instance.location.city());
```

Calling `load()` again returns a Promise for the ready instance. Await the Promise and handle `error` before accessing `instance`; `isLoading` is `true` while loading.

## Properties

- `instance` — the loaded Faker instance; it cannot be used before `load()` succeeds.
- `isLoading` — whether loading is in progress.
- `error` — the last loading error or `null`.

## Methods and Options

- `load(locale?)` — load a locale, defaulting to `defaultLocale` (`'en'`).
- `destroy()` — cancel the loader's internal lifecycle.
- `defaultLocale` — the default locale in the configuration.
- `abortSignal` — an external cancellation signal.
