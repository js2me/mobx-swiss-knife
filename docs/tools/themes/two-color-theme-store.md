# `TwoColorThemeStore`   

Tool for two color theming application   

## Usage  

```ts
import {
  TwoColorThemeStore,
  createTwoColorThemeStore,
} from "mobx-swiss-knife";
import { reaction } from "mobx"

const themeStore = new TwoColorThemeStore();
const themeStore = createTwoColorThemeStore()


reaction(
  () => themeStore.colorScheme === 'light',
  isLight => {
    console.log(isLight);
  }
);

themeStore.switchTheme();
themeStore.setTheme('auto');


reaction(
  () => themeStore.theme === 'auto',
  isAutoTheme => {
    console.log(
      isAutoTheme,
      themeStore.mediaColorScheme
    );
  }
);
```