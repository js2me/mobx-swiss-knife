# `FakerLoader`  

Tool for lazy loading `faker`

## Usage   

```ts
import { FakerLoader, createFakerLoader } from "mobx-swiss-knife";
import { reaction } from "mobx";

const faker = new FakerLoader();
const faker = createFakerLoader();

await faker.load();

reaction(() => faker.isLoading, noop);
reaction(() => faker.error, noop);

faker.instance; // Faker otherwise throw exception
```