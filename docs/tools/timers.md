# `Timers`  

Tool for better DX with async operations in classes   

## Usage   

```ts
import { Timers, createTimers } from "mobx-swiss-knife";

class MyVM {
  private timers = new Timers({
    abortSignal: this.abortController.signal,
  });


  @observable
  search = queryParams.data.search || ''

  @action
  setSearch = (search: string) => {
    this.search = search;

    this.timers.debounced(() => {
      queryParams.update({ search })
    }, 400);
  }
}
```
