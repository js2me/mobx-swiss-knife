import { createAtom, IAtom, reaction } from 'mobx';

import { NetworkStatusParams } from './model.types.js';

export class NetworkStatus {
  private atom: IAtom;
  private disposeFn?: VoidFunction;

  constructor(params?: NetworkStatusParams) {
    this.atom = createAtom(
      process.env.NODE_ENV === 'production' ? '' : 'networkStatusAtom',
      () => globalThis.addEventListener('online', this.atom.reportChanged),
      () => globalThis.removeEventListener('online', this.atom.reportChanged),
    );

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
    this.atom.reportObserved();
    return navigator.onLine;
  }

  get isOffline() {
    return !this.isOnline;
  }

  protected handleOnlineChange = () => {
    this.atom.reportChanged();
  };

  destroy() {
    this.atom.observers_.clear();
    this.disposeFn?.();
  }
}

export const createNetworkStatus = (params?: NetworkStatusParams) =>
  new NetworkStatus(params);
