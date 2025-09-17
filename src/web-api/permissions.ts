import { createAtom, type IAtom } from 'mobx';

export interface PermissionInfo {
  state: PermissionState;
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
}

type IPermissionAtom = IAtom & {
  listener: () => void;
  permissionStatus?: PermissionStatus;
};
const atoms = new Map<PermissionName, IPermissionAtom>();

const createPermissionInfo = (name: PermissionName): PermissionInfo => {
  return {
    get state(): PermissionState {
      if (!atoms.has(name) && 'permissions' in navigator) {
        const atom = createAtom(
          process.env.NODE_ENV === 'production' ? '' : `${name}_permission`,
          () => {
            if (!atom.permissionStatus) {
              navigator.permissions
                .query({
                  name,
                })
                .then((status) => {
                  atom.permissionStatus = status;
                  if (atom.permissionStatus.state !== 'prompt') {
                    atom?.reportChanged();
                  }
                  atom.permissionStatus.addEventListener(
                    'change',
                    atom!.listener,
                  );
                });
            }
          },
          () =>
            atom.permissionStatus?.removeEventListener(
              'change',
              atom!.listener,
            ),
        ) as IPermissionAtom;
        atom.listener = atom.reportChanged.bind(atom);
        atoms.set(name, atom);
      }

      const atom = atoms.get(name);

      atom?.reportObserved();
      return atom?.permissionStatus?.state ?? 'prompt';
    },
    get isGranted() {
      return this.state === 'granted';
    },
    get isDenied() {
      return this.state === 'denied';
    },
    get isPrompt() {
      return this.state === 'prompt';
    },
  };
};

export const permissions = new Proxy(
  {} as Record<PermissionName, PermissionInfo>,
  {
    get(target, property: PermissionName) {
      if (!target[property]) {
        target[property] = createPermissionInfo(property);
      }
      return target[property];
    },
  },
);
