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

