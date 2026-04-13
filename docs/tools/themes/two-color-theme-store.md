# `TwoColorThemeStore`

Helps manage the light and dark theme of an application from one place. It is useful for apps where the user can choose a theme manually or follow the system setting.

## When to use

- When you need to switch the app between light and dark themes.
- When it is important to support a "follow system" mode.
- When you want to persist the user's choice between sessions.

## What it can do

- Store the selected theme.
- Return the final color scheme that can be used directly in the UI.
- Switch the theme manually and react to the system theme.

## Constructor parameters

- `localStorageKey` — Storage key for the saved theme, or `false` to disable persistence.
- `fallbackTheme` — Default theme used when nothing is stored yet.
- `abortSignal` — Stops listeners and reactions when the related lifecycle is aborted.
- `onChangeTheme` — Called when the selected theme changes.
- `onChangeColorScheme` — Called when the final resolved color scheme changes.

## Public properties

- `theme` — Currently selected theme.
- `mediaColorScheme` — Current system color scheme.
- `colorScheme` — Final effective color scheme used by the app.

## Public methods

- `setTheme(theme)` — Sets the current theme explicitly.
- `switchTheme()` — Switches to the next theme in the built-in cycle.
- `destroy()` — Cleans up listeners and storage bindings.

## Usage example

```ts
import { createTwoColorThemeStore } from "mobx-swiss-knife";

const themeStore = createTwoColorThemeStore({
  localStorageKey: "app-theme",
});

console.log(themeStore.theme);
console.log(themeStore.colorScheme);

themeStore.setTheme("dark");
themeStore.switchTheme();

console.log(themeStore.mediaColorScheme);
```