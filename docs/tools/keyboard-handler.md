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

## Constructor parameters

- `actions` — List of shortcut actions, or a function that returns that list.
- `activateStrategy` — Defines when the handler should be considered active.
- `abortSignal` — Removes listeners when the related lifecycle is aborted.
- `onActivate` — Called when the handler becomes active.
- `onDeactivate` — Called when the handler becomes inactive.
- `onKeyClick` — Called on every keydown before shortcut matching.
- `listenerOpts` — Optional event listener settings for keyboard, mouse, and focus events.

## Public properties

- `isActivated` — Shows whether keyboard handling is currently active.
- `actions` — Returns the resolved list of available actions.

## Public methods

- `setActions(actions)` — Replaces the current action list for this instance.
- `activate()` — Manually enables the handler.
- `deactivate()` — Manually disables the handler.
- `checkKey(event, key)` — Checks whether an event matches a shortcut key part.
- `destroy()` — Removes listeners and stops the handler.

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