/* eslint-disable unicorn/consistent-function-scoping */
import { createAtom, IAtom, reaction } from 'mobx';

import { PageVisibilityParams } from './model.types.js';

export class PageVisibility {
  private disposeFn?: VoidFunction;

  private static atom?: IAtom;

  constructor(params?: PageVisibilityParams) {
    if (params?.whenVisible || params?.whenHidden) {
      this.disposeFn = reaction(
        () => this.isVisible,
        (isVisible) => {
          if (isVisible) {
            params?.whenVisible?.();
          } else {
            params?.whenHidden?.();
          }
        },
        { signal: params?.abortSignal, fireImmediately: true },
      );
    }
  }

  get isVisible() {
    return PageVisibility.isVisible;
  }

  get isHidden() {
    return PageVisibility.isHidden;
  }

  static get isVisible() {
    if (PageVisibility.atom === undefined) {
      PageVisibility.atom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'pageVisibilityAtom',
        () =>
          globalThis.addEventListener(
            'visibilitychange',
            PageVisibility.atom!.reportChanged,
          ),
        () =>
          globalThis.removeEventListener(
            'visibilitychange',
            PageVisibility.atom!.reportChanged,
          ),
      );
    }
    PageVisibility.atom.reportObserved();
    return document.visibilityState === 'visible';
  }

  static get isHidden() {
    return !this.isVisible;
  }

  destroy() {
    this.disposeFn?.();
  }
}

export const createPageVisibility = (params?: PageVisibilityParams) =>
  new PageVisibility(params);
