# `TabManager`   

Tool for working with "tabs" as UI components  

## Usage   

```ts
import { TabManager, createTabManager } from "mobx-swiss-knife";

const tabManager = new TabManager({
  tabs: [
    { id: 'home', key: 1 },
    { id: 'bar', key: 2 },
    { id: 'memes', key: 3 },
  ],
});
const tabManager = createTabManager()

tabManager.activeTabData.key;
tabManager.setActiveTab('bar')
```

Example with sync query params:   

```ts
const tabManager = new TabManager({
  tabs: [
    { id: 'home', key: 1 },
    { id: 'bar', key: 2 },
    { id: 'memes', key: 3 },
  ],
  getActiveTab: () => queryParams.data.tab,
  onChangeActiveTab: (tab) => queryParams.update({ tab }),
});
```