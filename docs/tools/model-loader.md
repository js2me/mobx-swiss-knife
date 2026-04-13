# `ModelLoader`

Helps lazily load models, services, and other data only when they are needed. It is especially useful when part of the functionality is not required immediately, but only after opening a specific block, tab, or screen.

## When to use

- When a model should be created only on first access.
- When you want to store the loaded result inside the current object and reuse it later.
- When you need a central place to understand whether something is loading or has failed.

## What it can do

- Load data by key.
- Bind the loading result to a property of the current object.
- Provide access to loaded data and loading state.

## Constructor parameters

- `context` — Object that will receive loaded values by key.
- `abortSignal` — Cancels the internal loading lifecycle.
- `throwOnError` — Re-throws loading errors instead of only storing them.
- `onLoadFailed` — Called when loading fails.
- `onLoadSucceed` — Called when loading succeeds.

## Public properties

- `hasLoadingModels` — Shows whether at least one model is still loading.
- `hasErroredModels` — Shows whether at least one model has failed.

## Public methods

- `load(key, fn)` — Loads a value by key and stores it in the context object.
- `connect({ property, fn })` — Starts loading and writes the result into the given property.
- `get(key)` — Returns the loaded value for a key.
- `getError(key)` — Returns the loading error for a key.
- `isLoading(key)` — Shows whether a specific key is still loading.
- `destroy()` — Stops the loader and clears its internal state.

## Usage example

```ts
import { createModelLoader } from "mobx-swiss-knife";

class ProfilePage {
  loader = createModelLoader({ context: this });

  profile = this.loader.connect({
    property: "profile",
    fn: async () => {
      return {
        name: "Anna",
        role: "admin",
      };
    },
  });

  async loadSettings() {
    await this.loader.load("settings", async () => {
      return {
        language: "ru",
      };
    });

    return this.loader.get("settings");
  }
}
```

