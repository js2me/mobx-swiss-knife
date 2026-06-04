---
"mobx-swiss-knife": patch
---

Fix `onChangeActiveTab` callback: now passes `activeTabData` (new tab data) as second argument and `prevActiveTabData` (previous tab data) as third argument, instead of duplicating the new tab data in both parameters
