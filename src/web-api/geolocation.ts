import { makeObservable, observable } from 'mobx';
import { type PermissionInfo, permissions } from './permissions.js';

export type GeolocationPosition = Omit<
  globalThis.GeolocationPosition,
  'toJSON'
>;
export type GeolocationError = globalThis.GeolocationPositionError;

type GeolocationProvider = {
  getCurrentPosition: () => Promise<GeolocationPosition>;
  watchPosition: (
    successCallback: (position: GeolocationPosition) => void,
    errorCallback: (error: GeolocationError) => void,
  ) => () => void;
};

// let defaultGeolocationProvider: GeolocationProvider | undefined;

export interface GeolocationInfo {
  permission: PermissionInfo;
  providers: GeolocationProvider[];
}

export const geolocation: GeolocationInfo = {
  providers: [],
  get permission() {
    return permissions.geolocation;
  },
  // get location(): any {
  //   if (this.providers.length) {
  //     this.providers.forEach((provider) => {
  //       // TODO:
  //     })
  //   } else if (!defaultGeolocationProvider && globalThis.navigator && 'geolocation' in globalThis.navigator) {
  //     defaultGeolocationProvider = {
  //       getCurrentPosition:
  //     }
  //     if (defaultGeolocationProvider) {
  //       this.providers.push(defaultGeolocationProvider);
  //     }
  //   }
  //   if (globalThis.navigator && 'geolocation' in globalThis.navigator) {
  //     return globalThis.navigator.geolocation;
  //   }

  //   return null;
  // },
};

makeObservable(geolocation, {
  providers: observable.deep,
});
