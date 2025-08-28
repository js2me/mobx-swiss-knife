import { createAtom, type IAtom } from 'mobx';

export interface PageVisibility {
  isVisible: boolean;
  isHidden: boolean;
}

let atom: IAtom | undefined;

export const pageVisibility: PageVisibility = {
  get isVisible() {
    if (!atom) {
      atom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'pageVisibility',
        () =>
          document.addEventListener('visibilitychange', atom!.reportChanged),
        () =>
          document.removeEventListener('visibilitychange', atom!.reportChanged),
      );
    }

    atom.reportObserved();
    return document.visibilityState === 'visible';
  },
  get isHidden() {
    return this.isVisible;
  },
};
