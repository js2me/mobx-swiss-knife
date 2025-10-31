import type { Faker } from '@faker-js/faker';
import { computed, makeObservable } from 'mobx';
import type { AnyObject } from 'yummies/types';

import { ModelLoader } from '../model-loader/model-loader.js';

import type { FakerLoaderConfig } from './model.types.js';

declare const process: { env: { NODE_ENV?: string } };

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/faker-loader)
 */
export class FakerLoader {
  private modelLoader: ModelLoader<AnyObject>;
  private locale: string;

  constructor(protected config?: FakerLoaderConfig) {
    this.modelLoader = new ModelLoader({
      context: this,
      abortSignal: config?.abortSignal,
    });
    this.locale = this.config?.defaultLocale ?? 'en';

    computed.struct(this, 'isLoading');
    computed.struct(this, 'error');
    makeObservable(this);
  }

  get instance(): Faker {
    const instance = this.modelLoader.get(this.locale);

    if (process.env.NODE_ENV !== 'production' && !instance) {
      throw new Error(
        `Faker instance with locale "${this.locale}" is not found.\n` +
          `Use method load() to load instance`,
      );
    }

    return instance!;
  }

  async load(locale: string = this.locale): Promise<Faker> {
    this.locale = locale;

    await this.modelLoader.load<Faker>(locale, async () => {
      const module = await import(`@faker-js/faker/locale/${locale}`);
      return module.faker;
    });

    return this.modelLoader.get(locale);
  }

  get isLoading() {
    return this.modelLoader.isLoading(this.locale);
  }

  get error() {
    return this.modelLoader.getError(this.locale);
  }

  destroy() {
    this.modelLoader.destroy();
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/faker-loader)
 */
export const createFakerLoader = (config?: FakerLoaderConfig) =>
  new FakerLoader(config);

/**
 * @deprecated use {FakerLoader}
 */
export const FakerModel = FakerLoader;
