import { createAtom, type IAtom } from 'mobx';

export interface PageVisibility {
  isVisible: boolean;
  isHidden: boolean;
}

type IAtomWithListener = IAtom & { listener: () => void };

let atom: IAtomWithListener | undefined;

export const pageVisibility: PageVisibility = {
  get isVisible() {
    if (!atom) {
      atom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'pageVisibility',
        () => document.addEventListener('visibilitychange', atom!.listener),
        () => document.removeEventListener('visibilitychange', atom!.listener),
      ) as IAtomWithListener;
      atom.listener = atom.reportChanged.bind(atom);
    }

    atom.reportObserved();
    return document.visibilityState === 'visible';
  },
  get isHidden() {
    return !this.isVisible;
  },
};
