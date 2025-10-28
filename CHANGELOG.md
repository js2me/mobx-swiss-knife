# mobx-swiss-knife

## 1.9.0

### Minor Changes

- [`e14ed26`](https://github.com/js2me/mobx-swiss-knife/commit/e14ed26b37e6153772844face4c3841145241d1b) Thanks [@js2me](https://github.com/js2me)! - [internal] unify bundle (use vite)

- [`e14ed26`](https://github.com/js2me/mobx-swiss-knife/commit/e14ed26b37e6153772844face4c3841145241d1b) Thanks [@js2me](https://github.com/js2me)! - added `KeyboardHandler` utility

## 1.8.1

### Patch Changes

- [`84005a0`](https://github.com/js2me/mobx-swiss-knife/commit/84005a03aacaf07086897d0c40f057f3d75f5652) Thanks [@js2me](https://github.com/js2me)! - fixed zshy build

## 1.8.0

### Minor Changes

- [`6a171df`](https://github.com/js2me/mobx-swiss-knife/commit/6a171df3432976d92166bd6c5fa261be81c09e17) Thanks [@js2me](https://github.com/js2me)! - refactor - migrate to zshy (build)

## 1.7.0

### Minor Changes

- [`2498305`](https://github.com/js2me/mobx-swiss-knife/commit/2498305f59bc91f4f2c1a208cd884a3984c260cc) Thanks [@js2me](https://github.com/js2me)! - moved `web-api` directory to another package (`mobx-web-api`). Minor change because this dir was not declared nowhere

## 1.6.0

### Minor Changes

- [`ecc63bf`](https://github.com/js2me/mobx-swiss-knife/commit/ecc63bf3b8f54d6d1ff13705734529583a2b0208) Thanks [@js2me](https://github.com/js2me)! - add geolocation web api

### Patch Changes

- [`ecc63bf`](https://github.com/js2me/mobx-swiss-knife/commit/ecc63bf3b8f54d6d1ff13705734529583a2b0208) Thanks [@js2me](https://github.com/js2me)! - fixed `TabManager` (local active tab)

## 1.5.0

### Minor Changes

- [`2e40be0`](https://github.com/js2me/mobx-swiss-knife/commit/2e40be01d7fb0aa1ad28b1b847beccf7f5b503cd) Thanks [@js2me](https://github.com/js2me)! - add ability to set position for adding step (`addStep` for `Stepper`)

- [`239ba5a`](https://github.com/js2me/mobx-swiss-knife/commit/239ba5a003a9622c93f70858638070162743e18f) Thanks [@js2me](https://github.com/js2me)! - added `networkStatus` and `pageVisibility` utils for web api

### Patch Changes

- [`2e69da7`](https://github.com/js2me/mobx-swiss-knife/commit/2e69da7b181c687c29d0a7162a66f674720213a5) Thanks [@js2me](https://github.com/js2me)! - added unit tests for Stepper, Storage, TabManager, Ticker models

## 1.4.0

### Minor Changes

- [`c9a387e`](https://github.com/js2me/mobx-swiss-knife/commit/c9a387e51d261e28baa09a56a4c22dd848c2dcf5) Thanks [@js2me](https://github.com/js2me)! - add `addStep` and `removeStep` methods for `Stepper`

## 1.3.0

### Minor Changes

- [`826d819`](https://github.com/js2me/mobx-swiss-knife/commit/826d819a06f5143e0b62a60cbcaf241b824e423e) Thanks [@js2me](https://github.com/js2me)! - make steps param accepts as fn in Stepper

### Patch Changes

- [`826d819`](https://github.com/js2me/mobx-swiss-knife/commit/826d819a06f5143e0b62a60cbcaf241b824e423e) Thanks [@js2me](https://github.com/js2me)! - add docs link to tools

## 1.2.1

### Patch Changes

- [`b04bcdd`](https://github.com/js2me/mobx-swiss-knife/commit/b04bcdd78586d60216630331a13208d507662029) Thanks [@js2me](https://github.com/js2me)! - fix `activeTab` for TabManager type

## 1.2.0

### Minor Changes

- [`a043199`](https://github.com/js2me/mobx-swiss-knife/commit/a043199b00dc6972493ecb7b66b48301e9311848) Thanks [@js2me](https://github.com/js2me)! - added destroy method for ModelLoader

- [`a043199`](https://github.com/js2me/mobx-swiss-knife/commit/a043199b00dc6972493ecb7b66b48301e9311848) Thanks [@js2me](https://github.com/js2me)! - added more documentation about tools

- [`a043199`](https://github.com/js2me/mobx-swiss-knife/commit/a043199b00dc6972493ecb7b66b48301e9311848) Thanks [@js2me](https://github.com/js2me)! - improve FakerLoader (added instance, isLoading, error properties)

- [`a043199`](https://github.com/js2me/mobx-swiss-knife/commit/a043199b00dc6972493ecb7b66b48301e9311848) Thanks [@js2me](https://github.com/js2me)! - improve TabManager -> fallbackTab make optional

## 1.1.1

### Patch Changes

- [`5d3b904`](https://github.com/js2me/mobx-swiss-knife/commit/5d3b9041730946e0f3a5bbf60030d9afa6bff1dc) Thanks [@js2me](https://github.com/js2me)! - improve model loader (load method returns promise)

## 1.1.0

### Minor Changes

- [`1e230b1`](https://github.com/js2me/mobx-swiss-knife/commit/1e230b1c0a875313e4e1f9593195ae246b382601) Thanks [@js2me](https://github.com/js2me)! - added empty documentation and improve ci/cd process

## 1.0.0

### Major Changes

- Renamed project to `mobxx-swiss-knife`. Previous name was `mobx-shared-entitiees`.
- Removed `disposer`, `dispose` methods and properties.
- Removed `disposer-util` dependency.
