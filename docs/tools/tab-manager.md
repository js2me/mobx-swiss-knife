# `TabManager`

Helps manage tabs in the UI by storing the list of tabs, the active tab, and the data for the current section. It is useful for pages with switchable sections, settings pages, dashboards, and admin panels.

## When to use

- When you want to store the active tab in one central place.
- When you need access to the current tab data without manually searching the array.
- When tab switching should be connected to external state such as a URL or a shared store.

## What it can do

- Switch the active tab.
- Return the data of the active tab.
- Work with either internal or external active-tab state.

## Usage example

```ts
import { createTabManager } from "mobx-swiss-knife";

const tabManager = createTabManager({
  tabs: [
    { id: "profile", title: "Profile" },
    { id: "security", title: "Security" },
    { id: "notifications", title: "Notifications" },
  ],
});

console.log(tabManager.activeTab);
console.log(tabManager.activeTabData.title);

tabManager.setActiveTab("security");
```

## Example with external state

```ts
import { createTabManager } from "mobx-swiss-knife";

const query = {
  tab: "profile",
};

const tabManager = createTabManager({
  tabs: [
    { id: "profile", title: "Profile" },
    { id: "security", title: "Security" },
  ],
  getActiveTab: () => query.tab,
  onChangeActiveTab: (tab) => {
    query.tab = tab;
  },
});
```