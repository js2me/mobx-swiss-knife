import { createAtom, type IAtom } from 'mobx';

export interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
}

type IAtomWithListener = IAtom & { listener: () => void };

let atom: IAtomWithListener | undefined;

export const networkStatus: NetworkStatus = {
  get isOnline() {
    if (!atom) {
      atom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'networkStatus',
        () => {
          globalThis.addEventListener('online', atom!.listener);
          globalThis.addEventListener('offline', atom!.listener);
        },
        () => {
          globalThis.removeEventListener('online', atom!.listener);
          globalThis.removeEventListener('offline', atom!.listener);
        },
      ) as IAtomWithListener;
      atom.listener = atom.reportChanged.bind(atom);
    }

    atom.reportObserved();
    return globalThis.navigator.onLine;
  },
  get isOffline() {
    return !this.isOnline;
  },
};
