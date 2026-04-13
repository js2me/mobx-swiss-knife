# `KeyboardHandler`

Helps define keyboard shortcuts and bind them to application actions. It works well for interfaces with keyboard-driven interactions such as panels, lists, tables, modals, and internal tools.

## When to use

- When you need to add clear keyboard shortcuts for user actions.
- When some commands should be enabled or disabled depending on the current screen state.
- When you want to manage keyboard actions in one place and properly clean them up on unmount.

## What it can do

- Trigger actions by keyboard shortcuts.
- Store the current list of actions and replace it with a new one.
- Work only in an active mode when that matters for a specific screen.

## Usage example

```ts
import { createKeyboardHandler } from "mobx-swiss-knife";

const keyboard = createKeyboardHandler({
  actions: [
    {
      shortcuts: ["Ctrl+S"],
      action: () => {
        console.log("Save");
      },
    },
    {
      shortcuts: ["Escape"],
      action: () => {
        console.log("Close");
      },
    },
  ],
});

keyboard.activate();

keyboard.setActions([
  {
    shortcuts: ["Enter"],
    action: () => {
      console.log("Confirm");
    },
  },
]);

keyboard.destroy();
```