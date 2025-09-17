import type { Maybe, MaybeFn } from 'yummies/utils/types';

export type TabManagerItem = { id: string | number | boolean };

export interface TabManagerConfig<
  TItem extends TabManagerItem | Readonly<TabManagerItem>,
> {
  tabs: MaybeFn<Maybe<ReadonlyArray<TItem> | Array<TItem>> | void>;
  /**
   * @deprecated
   * unused abort signal
   */
  abortSignal?: AbortSignal;
  /**
   * Otherwise first element of tabs
   */
  fallbackTab?: NoInfer<TItem>['id'];
  /**
   * This property is used to determine which tab is active
   * If you are using this property it means you are using
   * external active tab statement
   */
  getActiveTab?: () => Maybe<NoInfer<TItem>['id']>;
  /**
   * This is callback which calls always when you set active tab
   * using `setActiveTab` method
   */
  onChangeActiveTab?: (
    nextActiveTab: NoInfer<TItem>['id'],
    currentActiveTabData: TItem,
  ) => void;
}
