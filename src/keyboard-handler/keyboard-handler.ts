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
import type { Maybe, MaybeFn } from 'yummies/types';
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

  private localActions: MaybeFn<Maybe<Action[]>>;

  /**
   * Is user using keyboard input
   */
  isActivated: boolean;

  /**
   * User actions
   */
  get actions() {
    const usingActions = this.localActions ?? this.config.actions;
    return callFunction(usingActions) ?? [];
  }

  setActions(actions: Maybe<Action[]>) {
    this.localActions = actions;
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

    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i];
      const disabled = callFunction(action.disabled);

      if (disabled) {
        continue;
      }

      for (let j = 0; j < action.shortcuts.length; j++) {
        const shortcut = action.shortcuts[j];

        const keys = shortcut.split('+');

        if (keys.every((key) => this.checkKey(event, key))) {
          runInAction(() => {
            action.action(event);
          });
          return;
        }
      }
    }
  }

  checkKey(event: KeyboardEvent, key: string) {
    if (key === 'Shift' && event.shiftKey) return true;
    if (key === 'Ctrl' && event.ctrlKey) return true;
    if (key === 'Alt' && event.altKey) return true;
    if (
      (key === 'Windows' ||
        key === 'Meta' ||
        key === 'Command' ||
        key === '⌘' ||
        key === 'Win') &&
      event.metaKey
    )
      return true;
    return key === event.key;
  }

  destroy(): void {
    this.abortController.abort();
  }

  constructor(protected config: KeyboardHandlerConfig<Action>) {
    this.abortController = new LinkedAbortController(config.abortSignal);
    this.activateStrategy = this.config.activateStrategy ?? {
      type: 'immidiately',
    };
    this.isActivated = !!(this.activateStrategy.type === 'immidiately');

    observable.ref(this, 'isActivated');
    observable.ref(this, 'localActions');
    computed.struct(this, 'actions');
    action.bound(this, 'handleKeyboardClick');
    action.bound(this, 'setActions');
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
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/keyboard-handler)
 */
export const createKeyboardHandler = <Action extends KeyboardHandlerAction>(
  config: KeyboardHandlerConfig<Action>,
) => new KeyboardHandler(config);
