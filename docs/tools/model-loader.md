# `ModelLoader`

`ModelLoader` helps load models and services on demand without bloating a ViewModel constructor. It stores results by key, so the same loader can conveniently be used for multiple dependencies.

## Example: Load a Page Model

```ts
import { createModelLoader } from "mobx-swiss-knife";

class ProfilePage {
  loader = createModelLoader({ context: this });

  profile = this.loader.connect({
    property: "profile",
    fn: async () => {
      const response = await fetch('/api/profile');
      return response.json() as Promise<{ name: string; role: string }>;
    },
  });

  async loadSettings() {
    await this.loader.load('settings', async () =>
      (await fetch('/api/settings')).json(),
    );

    return this.loader.get('settings');
  }
}
```

`connect()` starts loading immediately and returns `null`; the result later appears in `context[property]`. If you need to manage the Promise manually, use `load(key, fn)`.

## State and Errors

```ts
const loader = createModelLoader({
  context: viewModel,
  throwOnError: false,
  onLoadFailed: (error, key) => reportError(key, error),
  onLoadSucceed: (data, key) => cache.set(key, data),
});

await loader.load('user', () => fetchUser());

loader.isLoading('user');
loader.get('user');
loader.getError('user');
```

With `throwOnError: true`, the error is rethrown by `load`; otherwise it is available through `getError`. `hasLoadingModels` and `hasErroredModels` are useful for a shared page indicator.

## Properties

- `hasLoadingModels` — whether at least one load is active.
- `hasErroredModels` — whether at least one model has an error.

## Methods and Options

- `load(key, fn)` — run the loader and store the result by key.
- `connect({ property, fn })` — bind loading to a `context` property.
- `get(key)`, `getError(key)`, `isLoading(key)` — read the result and state.
- `destroy()` — stop the loader; it does not remove already loaded data from `context`.
- `context` — the object whose property `connect` creates or updates.
- `abortSignal` — bind the loader to its owner's lifecycle.
