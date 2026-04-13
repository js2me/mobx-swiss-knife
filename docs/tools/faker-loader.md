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