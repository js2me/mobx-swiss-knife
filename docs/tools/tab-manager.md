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

## Constructor parameters

- `tabs` — Tab list or a function that returns the current list of tabs.
- `fallbackTab` — Tab id used when no active tab can be resolved.
- `getActiveTab` — External source of the current active tab id.
- `onChangeActiveTab(nextActiveTabId, activeTabData, prevActiveTabData)` — Called when the active tab changes. Receives the id and data of the new tab, and the data of the previously active tab.

## Public properties

- `tabs` — Current resolved list of tabs.
- `activeTab` — Id of the active tab.
- `tabsCount` — Total number of tabs.
- `activeTabData` — Data of the active tab.

## Public methods

- `setTabs(tabs)` — Replaces the current list of tabs for this instance.
- `getTabData(tabId)` — Returns data for a tab by id.
- `setActiveTab(tabId)` — Changes the active tab.
- `destroy()` — Deprecated no-op method kept for compatibility.

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