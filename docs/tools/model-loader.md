# `ModelLoader`  

Tool for lazy load various models or modules.   

## Usage   

```ts
import { ModelLoader, createModelLoader } from "mobx-swiss-knife";
import { reaction } from "mobx";

class YourVM {
  private modelLoader = new ModelLoader({ context: this });
  private modelLoader = createModelLoader({ context: this });

  applesModel = this.modelLoader.connect({
    property: 'applesModel',
    fn: () =>
      import('@/entities/apples/model')
        .then(m => {
          const ApplesModel = m.ApplesModel
          return new ApplesModel();
        })
  });

  async getMeme() {
    const memesModel = this.modelLoader.load('memes', async () => {
      const { MemesModel } = await import('@/entities/memes/model');
      return new MemesModel();
    })

    const meme = await memesModel.loadSomeMeme();

    return meme;
  }

  @computed.struct
  get isLoading() {
    return this.modelLoader.hasLoadingModels();
  }
}
```

