# `Storage`

`Storage` is a small typed layer over `localStorage` and `sessionStorage`. It serializes values with JSON, adds a namespace to keys, and can synchronize a MobX object property with storage.

## Example: Save User Settings

```ts
import { createStorage } from 'mobx-swiss-knife';

const storage = createStorage({
  prefix: 'app',
  namespace: 'settings',
});

storage.set({ key: 'table', value: { pageSize: 50, compact: true } });

const tableSettings = storage.get({
  key: 'table',
  fallback: { pageSize: 20, compact: false },
});

// Actual key: app/settings/table
console.log(tableSettings);
```

## Synchronizing a Property

```ts
class Settings {
  pageSize = 20;

  constructor() {
    const storage = createStorage({ namespace: 'settings' });
    storage.syncProperty(this, 'pageSize', { fallback: 20 });
  }
}
```

`syncProperty` first reads the stored value and then writes property changes. The returned disposer disables only this synchronization; `destroy()` disables all synchronizations for the instance.

## Configuration Properties

- `prefix`, `namespace` — shared parts of the key.
- `type` — `'local'` or `'session'`; defaults to `'local'`.
- `createKey(params)` — completely replace the key-building rules.
- `abortSignal` — bind the lifecycle to its owner.

## Methods

- `get({ key, fallback?, prefix?, namespace?, type? })` — return the JSON value or fallback. If the value is missing, the result is `null` or `fallback`.
- `set({ key, value, format?, prefix?, namespace?, type? })` — store a value. `format` enables custom serialization.
- `syncProperty(context, property, params?)` — bind a MobX property to storage and return a disposer.
- `destroy()` — stop reactions; it does not remove data from storage.

`StorageModel` and `createStorageModel` remain as deprecated aliases. Use `Storage` and `createStorage` in new code.
