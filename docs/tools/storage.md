# `Storage`  

Tool for `LocalStorage`/`SessionStorage` usage.  

## Usage  

```ts
import { Storage, createStorage } from "mobx-swiss-knife";
import { reaction } from "mobx";

const s = new Storage();
const s = createStorage();

s.set({
  key: 'foo',
  value: 1,
});

s.get<number>({
  key: 'foo',
});


class MyVM {
  private s: Storage;
  
  foo: number = 1;
  
  constructor() {
    this.s = new Storage();

    s.syncProperty(this, 'foo', {
      key: 'local-storage-key',
      fallback: 1,
      type: 'local',
    })
  }
}
```
