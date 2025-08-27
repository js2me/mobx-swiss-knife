/* eslint-disable unicorn/consistent-function-scoping */
import { createAtom, IAtom, reaction } from 'mobx';

import { NetworkStatusParams } from './model.types.js';

export class NetworkStatus {
  private disposeFn?: VoidFunction;

  private static atom?: IAtom;

  constructor(params?: NetworkStatusParams) {
    if (params?.whenOnline || params?.whenOffline) {
      this.disposeFn = reaction(
        () => this.isOnline,
        (isOnline) => {
          if (isOnline) {
            params?.whenOnline?.();
          } else {
            params?.whenOffline?.();
          }
        },
        { signal: params?.abortSignal, fireImmediately: true },
      );
    }
  }

  get isOnline() {
    return NetworkStatus.isOnline;
  }

  get isOffline() {
    return NetworkStatus.isOffline;
  }

  static get isOnline() {
    if (NetworkStatus.atom === undefined) {
      NetworkStatus.atom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'networkStatusAtom',
        () =>
          globalThis.addEventListener(
            'online',
            NetworkStatus.atom!.reportChanged,
          ),
        () =>
          globalThis.removeEventListener(
            'online',
            NetworkStatus.atom!.reportChanged,
          ),
      );
    }
    NetworkStatus.atom.reportObserved();
    return navigator.onLine;
  }

  static get isOffline() {
    return !this.isOnline;
  }

  destroy() {
    this.disposeFn?.();
  }
}

export const createNetworkStatus = (params?: NetworkStatusParams) =>
  new NetworkStatus(params);
