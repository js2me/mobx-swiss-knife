# `TwoColorThemeStore`

`TwoColorThemeStore` separates the theme selected by the user from the effective color scheme. `theme` can be `auto`, while `colorScheme` always returns either `light` or `dark`, which is convenient to apply to `data-theme` and CSS.

## Example: Application Theme

```ts
import { createTwoColorThemeStore } from "mobx-swiss-knife";

const themeStore = createTwoColorThemeStore({
  localStorageKey: 'app-theme',
  fallbackTheme: 'auto',
  onChangeColorScheme: (scheme) => {
    document.documentElement.dataset.theme = scheme;
  },
});

console.log(themeStore.theme);
console.log(themeStore.colorScheme);

themeStore.setTheme('dark');
themeStore.switchTheme();

console.log(themeStore.mediaColorScheme);
```

With `theme: 'auto'`, the store listens to `prefers-color-scheme` and changes `colorScheme` when the system setting changes. `onChangeTheme` and `onChangeColorScheme` are called immediately after the store is created and then on changes.

## Properties

- `theme` — the selected mode: `'light'`, `'dark'`, or `'auto'`.
- `mediaColorScheme` — the current system scheme: `'light'` or `'dark'`.
- `colorScheme` — the effective scheme to use in the UI.

## Methods and Options

- `setTheme(theme)` — set the mode explicitly.
- `switchTheme()` — cycle through `dark → auto → light → dark`.
- `destroy()` — remove the media-query listener and reactions.
- `localStorageKey` — the storage key; `false` disables persistence.
- `fallbackTheme` — the mode used when storage is empty; defaults to `'auto'`.
- `onChangeTheme`, `onChangeColorScheme` — change callbacks.
- `abortSignal` — an external lifecycle signal.
