import { createAtom, type IAtom } from 'mobx';

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
}

let atom: IAtom | undefined;

export const networkStatus: NetworkStatus = {
  get isOnline() {
    if (!atom) {
      atom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'networkStatus',
        () => globalThis.addEventListener('online', atom!.reportChanged),
        () => globalThis.removeEventListener('online', atom!.reportChanged),
      );
    }

    atom.reportObserved();
    return navigator.onLine;
  },
  get isOffline() {
    return !this.isOnline;
  },
};
