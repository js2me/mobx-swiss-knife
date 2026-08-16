# `KeyboardHandler`

`KeyboardHandler` maps key combinations to actions and manages the `keydown` listener. The handler executes only the first matching action. A shortcut string has the format `key1+key2+code`, such as `Ctrl+S`, `Shift+Enter`, `Meta+K`, or `KeyS`.

## Example: Editor Commands

```ts
import { createKeyboardHandler } from "mobx-swiss-knife";

const keyboard = createKeyboardHandler({
  actions: [
    {
      shortcuts: ['Ctrl+S', 'Meta+S'],
      action: (event) => {
        event.preventDefault();
        console.log('Save');
      },
    },
    {
      shortcuts: ['Escape'],
      disabled: () => !modalIsOpen,
      action: () => {
        console.log('Close modal');
      },
    },
  ],
});

// With the immediately strategy, this is already active.
console.log(keyboard.isActivated);

keyboard.deactivate();
keyboard.activate();

keyboard.destroy();
```

`disabled` can be a boolean or a function. This avoids recreating the handler whenever the screen state changes.

## Activation Strategies

```ts
createKeyboardHandler({
  actions,
  activateStrategy: { type: 'manual' },
});
```

- `{ type: 'immidiately' }` — active immediately; this is the default.
- `{ type: 'manual' }` — enabled only through `activate()`.
- `{ type: 'keyclick' }` — activated after a click or mouse movement.
- `{ type: 'element-focus', ref }` — active while the DOM element from `ref` has focus.

## Properties

- `isActivated` — whether the handler accepts shortcut events.
- `actions` — the current list of actions; if a function is provided, it is evaluated when read.

## Methods and Callbacks

- `setActions(actions)` — replace the local action list.
- `activate()` / `deactivate()` — enable or disable handling.
- `checkKey(event, key)` — check one shortcut part against `event.key`, `event.code`, or a modifier.
- `destroy()` — remove listeners.
- `onActivate`, `onDeactivate`, `onKeyClick` — lifecycle callbacks.
