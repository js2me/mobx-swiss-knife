import { computed, createAtom, type IAtom, makeObservable } from 'mobx';

export interface MediaQuerySize {
  width: number;
  height: number;
}

export type MediaQueryInfo = {
  _atom: IAtom;
  sizes: {
    inner: MediaQuerySize;
    outer: MediaQuerySize;
    client: MediaQuerySize;
  };
  track(): void;
};

const resizeHandler = () => {
  mediaQuery._atom.reportChanged();
};

export const mediaQuery = makeObservable<MediaQueryInfo>(
  {
    get sizes() {
      this._atom.reportObserved();
      return {
        inner: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        outer: {
          width: window.outerWidth,
          height: window.outerHeight,
        },
        client: {
          width: globalThis.document?.documentElement?.clientWidth ?? 0,
          height: globalThis.document?.documentElement?.clientHeight ?? 0,
        },
      };
    },
    track() {},
    _atom: createAtom(
      process.env.NODE_ENV === 'production' ? '' : 'mediaQuery_sizes',
      () => {
        globalThis.addEventListener('resize', resizeHandler);
      },
      () => {
        globalThis.removeEventListener('resize', resizeHandler);
      },
    ),
  },
  {
    sizes: computed.struct,
  },
);
