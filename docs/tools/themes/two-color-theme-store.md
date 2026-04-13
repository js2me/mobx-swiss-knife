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