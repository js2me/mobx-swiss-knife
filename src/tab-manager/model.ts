import { action, computed, makeObservable, observable } from 'mobx';

import type { TabManagerConfig, TabManagerItem } from './model.types.js';

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager)
 */
export class TabManager<T extends TabManagerItem | Readonly<TabManagerItem>> {
  /**
   * This is needed ONLY WHEN `getActiveTab` IS NOT SET
   */
  private localActiveTab!: T['id'];

  private localSettedTabs?: ReadonlyArray<T> | Array<T>;

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  get tabs() {
    if (this.localSettedTabs) {
      return this.localSettedTabs;
    }

    if (typeof this.config.tabs === 'function') {
      return this.config.tabs() ?? [];
    }

    return this.config.tabs ?? [];
  }

  protected get tabIndexesMap(): Map<T['id'], number> {
    return new Map(this.tabs.map((tab, i) => [tab.id, i]));
  }

  constructor(private config: TabManagerConfig<T>) {
    observable.ref(this, 'localActiveTab');
    observable.ref(this, 'localSettedTabs');
    action(this, 'setTabs');
    action(this, 'setActiveTab');
    computed.struct(this, 'activeTab');
    computed.struct(this, 'tabs');
    computed(this, 'tabIndexesMap');
    computed.struct(this, 'activeTabData');
    computed.struct(this, 'tabsCount');

    makeObservable(this);
  }

  /**
   * Sets local setted tabs
   * If you are using this method - it means that you are
   * using self controlled tabs.
   * So `tabManager.tabs` will be always equal to `tabs` which
   * you are passed to this method
   *
   * :NOTE: config.tabs function will be ignored!
   */
  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  setTabs = (tabs: Array<T> | ReadonlyArray<T>) => {
    this.localSettedTabs = tabs;
  };

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  getTabData = <TId extends T['id']>(tabId: TId): Extract<T, { id: TId }> => {
    const index = this.tabIndexesMap.get(tabId)!;
    return this.tabs[index] as Extract<T, { id: TId }>;
  };

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  get activeTab(): T['id'] {
    const tabId = this.config.getActiveTab
      ? this.config.getActiveTab(this.tabs)
      : this.localActiveTab;

    const activeTabId = tabId ?? this.config.fallbackTab ?? this.tabs[0].id;

    const tabData = this.getTabData(activeTabId);

    if (!tabData) {
      return this.config.fallbackTab ?? this.tabs[0].id;
    }

    return activeTabId;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  get tabsCount() {
    return this.tabs.length;
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  get activeTabData() {
    return this.getTabData(this.activeTab);
  }

  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  setActiveTab = (activeTabId: T['id']) => {
    if (this.activeTab === activeTabId) {
      return;
    }

    const activeTabData = this.getTabData(activeTabId);
    const prevActiveTabData = this.activeTabData;

    this.config.onChangeActiveTab?.(
      activeTabId,
      activeTabData,
      prevActiveTabData,
    );

    if (this.config.getActiveTab == null) {
      this.localActiveTab = activeTabId;
    }
  };

  /**
   * @deprecated nothing to destroy
   */
  /** [Documentation](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager) */
  destroy() {}
}

/**
 * [**Documentation**](https://js2me.github.io/mobx-swiss-knife/tools/tab-manager)
 */
export const createTabManager = <T extends TabManagerItem>(
  config: TabManagerConfig<T>,
) => new TabManager(config);
