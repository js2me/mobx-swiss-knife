import { LinkedAbortController } from 'linked-abort-controller';
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';

import type {
  InputPaginationData,
  PaginationData,
  PaginationOffsetData,
  PaginatorConfig,
} from './model.types.js';

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/paginator)
 */
export class Paginator {
  private abortController: AbortController;
  private page: number;

  private pageSize: number;

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  pageSizes: number[];

  private pagesCount: number;

  constructor({
    page,
    pageSize,
    pagesCount,
    pageSizes,
    abortSignal,
  }: PaginatorConfig) {
    this.abortController = new LinkedAbortController(abortSignal);

    this.page = page ?? 1;
    this.pageSize = pageSize ?? pageSizes[0] ?? 10;
    this.pagesCount = pagesCount ?? 1;
    this.pageSizes = pageSizes;

    observable.ref(this, 'page');
    observable.ref(this, 'pageSize');
    observable.ref(this, 'pageSizes');
    observable.ref(this, 'pagesCount');
    computed(this, 'inputData');
    computed(this, 'data');
    action.bound(this, 'toPreviousPage');
    action.bound(this, 'toNextPage');
    action.bound(this, 'toPage');
    action.bound(this, 'setPageSize');
    action.bound(this, 'setPagesCount');
    action.bound(this, 'setPageSizes');
    action.bound(this, 'reset');

    makeObservable(this);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  get inputData(): InputPaginationData {
    return {
      page: this.page,
      pageSize: this.pageSize,
    };
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  get data(): PaginationData {
    return {
      ...this.inputData,
      pagesCount: this.pagesCount,
    };
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  toPreviousPage() {
    this.toPage(this.page - 1);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  toNextPage() {
    this.toPage(this.page + 1);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  toPage(page: number) {
    this.page = Math.max(1, Math.min(page, this.pagesCount));
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.reset();
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  setPagesCount(pagesCount: number) {
    this.pagesCount = pagesCount;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  setPageSizes(pageSizes: number[]) {
    this.pageSizes = pageSizes;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  reset() {
    this.toPage(1);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  syncWith(getParametersFunction: () => Partial<PaginationData>) {
    reaction(
      getParametersFunction,
      ({ pageSize, page, pagesCount: totalPages }) => {
        runInAction(() => {
          this.pageSize = pageSize ?? this.pageSize;
          this.page = page ?? this.page;
          this.pagesCount = totalPages ?? this.pagesCount;
        });
      },
      {
        fireImmediately: true,
        signal: this.abortController.signal,
      },
    );
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  createFromOffsetData({
    offset,
    limit,
    count,
  }: PaginationOffsetData): PaginationData {
    const page = Math.floor(offset / limit) + 1;
    const pagesCount = Math.ceil(count / limit);
    const pageSize = limit;

    return {
      pagesCount,
      page,
      pageSize,
    };
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  createOffsetData({
    pageSize,
    pagesCount,
    page,
  }: PaginationData): PaginationOffsetData {
    return {
      limit: pageSize,
      count: pagesCount * pageSize,
      offset: (page - 1) * pageSize,
    };
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  toOffsetData(): PaginationOffsetData {
    return this.createOffsetData(this.data);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/paginator) */
  destroy() {
    this.abortController.abort();
  }
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/paginator)
 */
export const createPaginator = (config: PaginatorConfig) =>
  new Paginator(config);
