# `TabManager`

`TabManager` keeps a list of tabs and the selected `id`, while `activeTabData` returns the already found record. This removes repeated `tabs.find(...)` calls from components.

## Example: Settings Tabs

```ts
import { createTabManager } from "mobx-swiss-knife";

const tabManager = createTabManager({
  tabs: [
    { id: 'profile', title: 'Profile' },
    { id: 'security', title: 'Security' },
    { id: 'notifications', title: 'Notifications' },
  ],
  fallbackTab: 'profile',
  onChangeActiveTab: (next, nextData, previousData) => {
    analytics.track('settings_tab_changed', {
      from: previousData?.id,
      to: next,
      title: nextData.title,
    });
  },
});

console.log(tabManager.activeTab);
console.log(tabManager.activeTabData?.title);

tabManager.setActiveTab('security');
```

## External Source for the Selected Tab

```ts
import { createTabManager } from "mobx-swiss-knife";

const query = {
  tab: 'profile',
};

const tabManager = createTabManager({
  tabs: [
    { id: 'profile', title: 'Profile' },
    { id: 'security', title: 'Security' },
  ],
  getActiveTab: () => query.tab,
  onChangeActiveTab: (tab) => {
    query.tab = tab;
  },
});
```

`getActiveTab` reads external state, such as a query parameter. `onChangeActiveTab` writes the new id back to the URL or store.

## Properties

- `tabs` — the current list; it can also be provided as a function.
- `activeTab` — the selected tab id.
- `activeTabData` — the selected tab record or `undefined` if it does not exist.
- `tabsCount` — the number of tabs.

## Methods and Options

- `setTabs(tabs)` — replace the list.
- `getTabData(tabId)` — find a record by id.
- `setActiveTab(tabId)` — select a tab and call `onChangeActiveTab`.
- `fallbackTab` — the id used when the external source does not return a valid tab; otherwise the first tab is used.
- `destroy()` — a deprecated no-op retained for compatibility.
