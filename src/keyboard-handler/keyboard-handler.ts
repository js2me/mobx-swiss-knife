import { LinkedAbortController } from 'linked-abort-controller';
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';
import { callFunction } from 'yummies/common';
import type {
  KeyboardHandlerAction,
  KeyboardHandlerActivationStrategy,
  KeyboardHandlerConfig,
} from './keyboard-handler.types.js';

/**
 * Keyboard events handler
 *
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/keyboard-handler)
 */
export class KeyboardHandler<Action extends KeyboardHandlerAction> {
  protected abortController: LinkedAbortController;

  protected activateStrategy: KeyboardHandlerActivationStrategy;

  /**
   * Is user using keyboard input
   */
  isActivated: boolean;

  /**
   * User actions
   */
  get actions() {
    return callFunction(this.config.actions) ?? [];
  }

  constructor(protected config: KeyboardHandlerConfig<Action>) {
    this.abortController = new LinkedAbortController(config.abortSignal);
    this.activateStrategy = this.config.activateStrategy ?? {
      type: 'immidiately',
    };
    this.isActivated = !!(this.activateStrategy.type === 'immidiately');

    observable.ref(this, 'isActivated');
    computed.struct(this, 'actions');
    action.bound(this, 'handleKeyboardClick');
    makeObservable(this);

    if (this.activateStrategy.type === 'element-focus') {
      const ref = this.activateStrategy.ref;
      let nodeAbortController = new LinkedAbortController();

      reaction(
        () => ref.current,
        (node) => {
          if (node) {
            if (globalThis.document?.activeElement === node) {
              this.activate();
            }
            node.addEventListener('focus', this.activate, {
              signal: nodeAbortController.signal,
            });
            node.addEventListener('blur', this.deactivate, {
              signal: nodeAbortController.signal,
            });
          } else {
            nodeAbortController.abort();
            nodeAbortController = new LinkedAbortController(
              this.abortController.signal,
            );
          }
        },
        { fireImmediately: true, signal: this.abortController.signal },
      );
    }

    globalThis.addEventListener('keydown', this.handleKeyboardClick, {
      signal: this.abortController.signal,
    });

    if (config.activateStrategy?.type === 'keyclick') {
      globalThis.addEventListener('click', this.activate, {
        signal: this.abortController.signal,
      });
      globalThis.addEventListener('mousemove', this.activate, {
        signal: this.abortController.signal,
      });
    }
  }

  activate = () => {
    if (this.isActivated) {
      return;
    }
    this.isActivated = true;
    this.config.onActivate?.();
  };

  deactivate = () => {
    if (!this.isActivated) {
      return;
    }
    this.isActivated = false;
    this.config.onDeactivate?.();
  };

  protected handleKeyboardClick(event: KeyboardEvent) {
    this.config.onKeyClick?.(event);

    if (this.activateStrategy.type === 'keyclick') {
      this.activate();
    }

    if (!this.isActivated) {
      return;
    }

    for (const action of this.actions) {
      const disabled = callFunction(action.disabled);

      if (disabled) {
        continue;
      }

      for (const shortcut of action.shortcuts) {
        const combinatedShortcuts = shortcut.split('+');
        if (
          combinatedShortcuts.every((shortcut) =>
            this.checkShortcut(event, shortcut),
          )
        ) {
          runInAction(() => {
            action.action(event);
          });
          return;
        }
      }
    }
  }

  checkShortcut(event: KeyboardEvent, shortcut: string) {
    if (shortcut === 'Shift' && event.shiftKey) return true;
    if (shortcut === 'Ctrl' && event.ctrlKey) return true;
    if (shortcut === 'Alt' && event.altKey) return true;
    return shortcut === event.key;
  }

  destroy(): void {
    this.abortController.abort();
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/keyboard-handler)
 */
export const createKeyboardHandler = <Action extends KeyboardHandlerAction>(
  config: KeyboardHandlerConfig<Action>,
) => new KeyboardHandler(config);
