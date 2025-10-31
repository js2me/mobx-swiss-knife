import type { Ref } from 'yummies/mobx';
import type { Maybe, MaybeFn } from 'yummies/types';

export interface KeyboardHandlerAction {
  /**
   * Syntax: key1+key2
   *
   *
   * [MDN Reference for keys](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key)
   *
   * @example
   * 'Shift'
   * 'Shift+Enter'
   * 'Enter'
   */
  shortcuts: string[];
  disabled?: MaybeFn<Maybe<boolean>>;
  action: (event: KeyboardEvent) => void;
}

export type KeyboardHandlerActivationStrategy =
  | {
      type: 'keyclick';
    }
  | {
      type: 'immidiately';
    }
  | {
      type: 'manual';
    }
  | {
      type: 'element-focus';
      ref: Ref<HTMLElement>;
    };

export interface KeyboardHandlerConfig<Action extends KeyboardHandlerAction> {
  onActivate?: VoidFunction;
  onDeactivate?: VoidFunction;
  onKeyClick?: (e: KeyboardEvent) => void;

  abortSignal?: AbortSignal;
  activateStrategy?: KeyboardHandlerActivationStrategy;

  actions: MaybeFn<Action[]>;
}
