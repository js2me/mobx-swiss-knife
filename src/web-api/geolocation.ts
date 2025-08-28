import { createAtom, type IAtom } from 'mobx';

export interface GeolocationStatus {
  permission: PermissionState;
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
}

let geolocationPermissiongStatus: PermissionStatus | undefined;
let geoPermissionAtom: IAtom | undefined;

export const geolocationStatus: GeolocationStatus = {
  get permission(): PermissionState {
    if (!geoPermissionAtom && 'permissions' in navigator) {
      geoPermissionAtom = createAtom(
        process.env.NODE_ENV === 'production' ? '' : 'geolocationStatus',
        async () => {
          if (!geolocationPermissiongStatus) {
            geolocationPermissiongStatus = await navigator.permissions.query({
              name: 'geolocation',
            });
          }
          geolocationPermissiongStatus.addEventListener(
            'change',
            geoPermissionAtom!.reportChanged,
          );
        },
        async () => {
          geolocationPermissiongStatus?.removeEventListener(
            'change',
            geoPermissionAtom!.reportChanged,
          );
        },
      );
    }

    geoPermissionAtom?.reportObserved();
    return 'granted';
  },

  get isGranted() {
    return this.permission === 'granted';
  },

  get isDenied() {
    return this.permission === 'denied';
  },

  get isPrompt() {
    return this.permission === 'prompt';
  },
};
