# `KeyboardHandler`   

Tool for working with keyboard events   

## Usage   

```ts
import { KeyboardHandler, createKeyboardHandler } from "mobx-swiss-knife";

const keyboardHandler = new KeyboardHandler({
  abortSignal: this.unmountSignal,
  actions: [
    {
      shortcuts: ['Ctrl+Shift+F12'],
      action: () => {
        this.handleToggleOpen();
      },
    },
    {
      shortcuts: ['Ctrl+ArrowLeft'],
      action: () => {
        if (this.expandedByDefault.allProperties) {
          this.expandedByDefault.allProperties = false;
        } else {
          this.expandedByDefault.allVms = false;
        }
      },
    },
    {
      shortcuts: ['Ctrl+ArrowRight'],
      action: () => {
        if (this.expandedByDefault.allVms) {
          this.expandedByDefault.allProperties = true;
        } else {
          this.expandedByDefault.allVms = true;
        }
      },
    },
    {
      shortcuts: ['Ctrl+ArrowDown'],
      action: () => {
        requestAnimationFrame(() => {
          this.containerRef.current!.scrollTop += 200;
        });
      },
    },
    {
      shortcuts: ['Ctrl+ArrowUp'],
      disabled: true,
      action: () => {
        requestAnimationFrame(() => {
          this.containerRef.current!.scrollTop -= 200;
        });
      },
    },
  ],
});
const keyboardHandler = createKeyboardHandler()

```