import { describe, expect, it, vi } from 'vitest';

import { Paginator } from './model.js';

describe('Paginator', () => {
  const defaultPageSizes = [10, 25, 50];

  it('should initialize with default values', () => {
    const paginator = new Paginator({
      pageSizes: defaultPageSizes,
    });

    expect(paginator.data.page).toBe(1);
    expect(paginator.data.pageSize).toBe(10);
    expect(paginator.data.pagesCount).toBe(1);
  });

  it('should initialize with provided values', () => {
    const paginator = new Paginator({
      page: 5,
      pageSize: 25,
      pagesCount: 10,
      pageSizes: defaultPageSizes,
    });

    expect(paginator.data.page).toBe(5);
    expect(paginator.data.pageSize).toBe(25);
    expect(paginator.data.pagesCount).toBe(10);
  });

  it('should handle page navigation correctly', () => {
    const paginator = new Paginator({
      page: 1,
      pageSize: 10,
      pagesCount: 5,
      pageSizes: defaultPageSizes,
    });

    paginator.toNextPage();
    expect(paginator.data.page).toBe(2);

    paginator.toPreviousPage();
    expect(paginator.data.page).toBe(1);

    paginator.toPage(4);
    expect(paginator.data.page).toBe(4);

    paginator.toPage(10);
    expect(paginator.data.page).toBe(5);

    paginator.toPage(0);
    expect(paginator.data.page).toBe(1);
  });

  it('should set page size correctly', () => {
    const paginator = new Paginator({
      page: 3,
      pageSize: 10,
      pagesCount: 5,
      pageSizes: defaultPageSizes,
    });

    paginator.setPageSize(25);
    expect(paginator.data.pageSize).toBe(25);
    expect(paginator.data.page).toBe(1);
  });

  it('should set pages count correctly', () => {
    const paginator = new Paginator({
      page: 1,
      pageSize: 10,
      pagesCount: 5,
      pageSizes: defaultPageSizes,
    });

    paginator.setPagesCount(10);
    expect(paginator.data.pagesCount).toBe(10);
  });

  it('should set page sizes correctly', () => {
    const paginator = new Paginator({
      page: 1,
      pageSize: 10,
      pagesCount: 5,
      pageSizes: defaultPageSizes,
    });

    const newPageSizes = [5, 15, 30];
    paginator.setPageSizes(newPageSizes);
    expect(paginator.pageSizes).toEqual(newPageSizes);
  });

  it('should reset to first page', () => {
    const paginator = new Paginator({
      page: 3,
      pageSize: 10,
      pagesCount: 5,
      pageSizes: defaultPageSizes,
    });

    paginator.toPage(5);
    paginator.reset();
    expect(paginator.data.page).toBe(1);
  });

  it('should create pagination data from offset data', () => {
    const paginator = new Paginator({
      pageSizes: defaultPageSizes,
    });

    const offsetData = {
      offset: 20,
      limit: 10,
      count: 100,
    };

    const paginationData = paginator.createFromOffsetData(offsetData);
    expect(paginationData.page).toBe(3);
    expect(paginationData.pageSize).toBe(10);
    expect(paginationData.pagesCount).toBe(10);
  });

  it('should create offset data from pagination data', () => {
    const paginator = new Paginator({
      pageSizes: defaultPageSizes,
    });

    const paginationData = {
      page: 3,
      pageSize: 10,
      pagesCount: 10,
    };

    const offsetData = paginator.createOffsetData(paginationData);
    expect(offsetData.offset).toBe(20);
    expect(offsetData.limit).toBe(10);
    expect(offsetData.count).toBe(100);
  });

  it('should convert to offset data', () => {
    const paginator = new Paginator({
      page: 3,
      pageSize: 10,
      pagesCount: 10,
      pageSizes: defaultPageSizes,
    });

    const offsetData = paginator.toOffsetData();
    expect(offsetData.offset).toBe(20);
    expect(offsetData.limit).toBe(10);
    expect(offsetData.count).toBe(100);
  });

  it('should sync with parameters correctly', () => {
    const paginator = new Paginator({
      page: 1,
      pageSize: 10,
      pagesCount: 5,
      pageSizes: defaultPageSizes,
    });

    const getParams = vi.fn(() => ({
      pageSize: 25,
      page: 3,
      pagesCount: 10,
    }));

    paginator.syncWith(getParams);

    expect(paginator.data.pageSize).toBe(25);
    expect(paginator.data.page).toBe(3);
    expect(paginator.data.pagesCount).toBe(10);
  });

  it('should destroy correctly', () => {
    const paginator = new Paginator({
      pageSizes: defaultPageSizes,
    });

    // @ts-ignore
    const innerAbortController = paginator.abortController;

    const abortSpy = vi.spyOn(innerAbortController, 'abort');
    paginator.destroy();
    expect(abortSpy).toHaveBeenCalled();
  });

  it('should handle abort signal correctly', () => {
    const abortController = new AbortController();
    const paginator = new Paginator({
      pageSizes: defaultPageSizes,
      abortSignal: abortController.signal,
    });

    // @ts-ignore
    const innerAbortController = paginator.abortController;

    expect(innerAbortController.signal).toStrictEqual(abortController.signal);
  });
});
