import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createTabManager, TabManager } from './model.js';
import type { TabManagerConfig, TabManagerItem } from './model.types.js';

// Helper types
type TestTab = TabManagerItem & { title: string; content: string };

describe('TabManager', () => {
  let mockAbortController: AbortController;

  beforeEach(() => {
    mockAbortController = new AbortController();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with basic configuration', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabManager).toBeDefined();
      expect(tabManager.tabs).toEqual(tabs);
      expect(tabIndexesMap.size).toBe(2);
      expect(tabIndexesMap.get('tab1')).toBe(0);
      expect(tabIndexesMap.get('tab2')).toBe(1);
    });

    it('should handle empty tabs array', () => {
      const config: TabManagerConfig<TestTab> = {
        tabs: () => [],
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabManager.tabs).toEqual([]);
      expect(tabIndexesMap.size).toBe(0);
    });

    it('should handle readonly tabs array', () => {
      const tabs: ReadonlyArray<TestTab> = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabManager.tabs).toEqual(tabs);
      expect(tabIndexesMap.size).toBe(2);
    });

    it('should handle abort signal correctly', () => {
      const tabs = [{ id: 'tab1', title: 'Tab 1', content: 'Content 1' }];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        abortSignal: mockAbortController.signal,
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      expect(tabManager.abortController).toBeDefined();
    });
  });

  describe('setTabs', () => {
    it('should update tabs and rebuild index map', () => {
      const initialTabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const newTabs = [
        { id: 'tab3', title: 'Tab 3', content: 'Content 3' },
        { id: 'tab4', title: 'Tab 4', content: 'Content 4' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => initialTabs,
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabManager.tabs).toEqual(initialTabs);
      expect(tabIndexesMap.get('tab1')).toBe(0);
      expect(tabIndexesMap.get('tab2')).toBe(1);

      tabManager.setTabs(newTabs);

      expect(tabManager.tabs).toEqual(newTabs);
      expect(tabIndexesMap.get('tab3')).toBe(0);
      expect(tabIndexesMap.get('tab4')).toBe(1);
      expect(tabIndexesMap.get('tab1')).toBeUndefined();
    });

    it('should handle empty tabs array in setTabs', () => {
      const initialTabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => initialTabs,
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabManager.tabs).toEqual(initialTabs);

      tabManager.setTabs([]);

      expect(tabManager.tabs).toEqual([]);
      expect(tabIndexesMap.size).toBe(0);
    });
  });

  describe('getTabData', () => {
    it('should retrieve tab data by ID', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      const tabData1 = tabManager.getTabData('tab1');
      const tabData2 = tabManager.getTabData('tab2');

      expect(tabData1).toEqual(tabs[0]);
      expect(tabData2).toEqual(tabs[1]);
    });

    it('should return undefined if tab ID does not exist', () => {
      const tabs = [{ id: 'tab1', title: 'Tab 1', content: 'Content 1' }];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.getTabData('nonexistent')).toBeUndefined();
    });

    it('should handle numeric tab IDs', () => {
      const tabs = [
        { id: 1, title: 'Tab 1', content: 'Content 1' },
        { id: 2, title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      const tabData1 = tabManager.getTabData(1);
      const tabData2 = tabManager.getTabData(2);

      expect(tabData1).toEqual(tabs[0]);
      expect(tabData2).toEqual(tabs[1]);
    });

    it('should handle boolean tab IDs', () => {
      const tabs = [
        { id: true, title: 'Tab True', content: 'Content True' },
        { id: false, title: 'Tab False', content: 'Content False' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      const tabDataTrue = tabManager.getTabData(true);
      const tabDataFalse = tabManager.getTabData(false);

      expect(tabDataTrue).toEqual(tabs[0]);
      expect(tabDataFalse).toEqual(tabs[1]);
    });
  });

  describe('activeTab getter', () => {
    it('should return first tab when no active tab is set and no fallback', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab1');
    });

    it('should return fallback tab when no active tab is set and fallback is provided', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        fallbackTab: 'tab2',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab2');
    });

    it('should return active tab from external getter when provided', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 'tab2',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab2');
    });

    it('should return fallback when external getter returns null/undefined', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => null,
        fallbackTab: 'tab2',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab2');
    });

    it('should return first tab when external getter returns invalid tab ID', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 'invalid-tab',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab1');
    });

    it('should return fallback when external getter returns invalid tab ID and fallback is provided', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 'invalid-tab',
        fallbackTab: 'tab2',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab2');
    });

    it('should handle numeric tab IDs in activeTab getter', () => {
      const tabs = [
        { id: 1, title: 'Tab 1', content: 'Content 1' },
        { id: 2, title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 2,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe(2);
    });

    it('should handle boolean tab IDs in activeTab getter', () => {
      const tabs = [
        { id: true, title: 'Tab True', content: 'Content True' },
        { id: false, title: 'Tab False', content: 'Content False' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => false,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe(false);
    });
  });

  describe('activeTabData getter', () => {
    it('should return tab data for active tab', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 'tab2',
      };

      const tabManager = new TabManager(config);

      const activeTabData = tabManager.activeTabData;

      expect(activeTabData).toEqual(tabs[1]);
    });

    it('should return first tab data when no active tab is set', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      const activeTabData = tabManager.activeTabData;

      expect(activeTabData).toEqual(tabs[0]);
    });

    it('should return fallback tab data when no active tab is set and fallback is provided', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        fallbackTab: 'tab2',
      };

      const tabManager = new TabManager(config);

      const activeTabData = tabManager.activeTabData;

      expect(activeTabData).toEqual(tabs[1]);
    });
  });

  describe('setActiveTab', () => {
    it('should set active tab when using local storage', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab1');

      tabManager.setActiveTab('tab2');

      expect(tabManager.activeTab).toBe('tab2');
    });

    it('should not set active tab when it is already active', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab1');

      tabManager.setActiveTab('tab1');

      expect(tabManager.activeTab).toBe('tab1');
    });

    it('should call onChangeActiveTab when using external active tab management', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const onChangeActiveTab = vi.fn();

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 'tab1',
        onChangeActiveTab,
      };

      const tabManager = new TabManager(config);

      tabManager.setActiveTab('tab2');

      expect(onChangeActiveTab).toHaveBeenCalledWith('tab2', tabs[0]);
    });

    it('should not call onChangeActiveTab when using local active tab management', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const onChangeActiveTab = vi.fn();

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        onChangeActiveTab,
      };

      const tabManager = new TabManager(config);

      tabManager.setActiveTab('tab2');

      expect(onChangeActiveTab).not.toHaveBeenCalled();
    });

    it('should handle numeric tab IDs in setActiveTab', () => {
      const tabs = [
        { id: 1, title: 'Tab 1', content: 'Content 1' },
        { id: 2, title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe(1);

      tabManager.setActiveTab(2);

      expect(tabManager.activeTab).toBe(2);
    });

    it('should handle boolean tab IDs in setActiveTab', () => {
      const tabs = [
        { id: true, title: 'Tab True', content: 'Content True' },
        { id: false, title: 'Tab False', content: 'Content False' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe(true);

      tabManager.setActiveTab(false);

      expect(tabManager.activeTab).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should abort the internal abort controller and do not abort the provided abort signal', () => {
      const tabs = [{ id: 'tab1', title: 'Tab 1', content: 'Content 1' }];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        abortSignal: mockAbortController.signal,
      };

      const tabManager = new TabManager(config);

      expect(mockAbortController.signal.aborted).toBe(false);

      tabManager.destroy();

      expect(mockAbortController.signal.aborted).toBe(false);
    });

    it('should abort the internal abort controller by aborting provider abort signal', () => {
      const tabs = [{ id: 'tab1', title: 'Tab 1', content: 'Content 1' }];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        abortSignal: mockAbortController.signal,
      };

      const tabManager = new TabManager(config);
      // @ts-ignore
      const innerAbortController = tabManager.abortController;

      expect(innerAbortController.signal.aborted).toBe(false);

      mockAbortController.abort();

      expect(innerAbortController.signal.aborted).toBe(true);
    });
  });

  describe('reaction to tab changes', () => {
    it('should react to tab changes and update internal state', () => {
      const initialTabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
      ];

      const updatedTabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const tabsGetter = vi.fn().mockReturnValue(initialTabs);

      const config: TabManagerConfig<TestTab> = {
        tabs: tabsGetter,
      };

      const tabManager = new TabManager(config);
      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabManager.tabs).toEqual(initialTabs);
      expect(tabIndexesMap.size).toBe(1);

      tabsGetter.mockReturnValue(updatedTabs);

      tabManager.setTabs(updatedTabs);

      expect(tabManager.tabs).toEqual(updatedTabs);
      expect(tabIndexesMap.size).toBe(2);
      expect(tabIndexesMap.get('tab1')).toBe(0);
      expect(tabIndexesMap.get('tab2')).toBe(1);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle null tabs from getter', () => {
      const config: TabManagerConfig<TestTab> = {
        tabs: () => null as any,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.tabs).toEqual([]);
    });

    it('should handle undefined tabs from getter', () => {
      const config: TabManagerConfig<TestTab> = {
        tabs: () => {},
      };

      const tabManager = new TabManager(config);

      expect(tabManager.tabs).toEqual([]);
    });

    it('should handle invalid tab IDs gracefully', () => {
      const tabs = [{ id: 'tab1', title: 'Tab 1', content: 'Content 1' }];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
        getActiveTab: () => 'invalid-tab-id',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab1');
    });

    it('should handle empty tabs array with fallback', () => {
      const config: TabManagerConfig<TestTab> = {
        tabs: () => [],
        fallbackTab: 'fallback-tab',
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('fallback-tab');
    });

    it('should handle empty tabs array with no fallback', () => {
      const config: TabManagerConfig<TestTab> = {
        tabs: () => [],
      };

      const tabManager = new TabManager(config);

      expect(() => tabManager.activeTab).toThrow();
    });
  });

  describe('createTabManager factory function', () => {
    it('should create a TabManager instance using factory function', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = createTabManager(config);

      expect(tabManager).toBeInstanceOf(TabManager);
      expect(tabManager.tabs).toEqual(tabs);
    });
  });

  describe('complex scenarios', () => {
    it('should handle tabs with mixed data types as IDs', () => {
      const tabs = [
        { id: 'string-id', title: 'String Tab', content: 'Content' },
        { id: 123, title: 'Number Tab', content: 'Content' },
        { id: true, title: 'Boolean Tab', content: 'Content' },
        { id: false, title: 'Boolean False Tab', content: 'Content' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.getTabData('string-id')).toEqual(tabs[0]);
      expect(tabManager.getTabData(123)).toEqual(tabs[1]);
      expect(tabManager.getTabData(true)).toEqual(tabs[2]);
      expect(tabManager.getTabData(false)).toEqual(tabs[3]);

      expect(tabManager.activeTab).toBe('string-id');
    });

    it('should properly handle tab updates with different tab structures', () => {
      const initialTabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
      ];

      const updatedTabs = [
        { id: 'tab1', title: 'Updated Tab 1', content: 'Updated Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => initialTabs,
      };

      const tabManager = new TabManager(config);

      expect(tabManager.activeTab).toBe('tab1');
      expect(tabManager.activeTabData.title).toBe('Tab 1');

      tabManager.setTabs(updatedTabs);

      expect(tabManager.activeTab).toBe('tab1');
      expect(tabManager.activeTabData.title).toBe('Updated Tab 1');
    });

    it('should handle multiple setActiveTab calls efficiently', () => {
      const tabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
        { id: 'tab3', title: 'Tab 3', content: 'Content 3' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => tabs,
      };

      const tabManager = new TabManager(config);

      tabManager.setActiveTab('tab2');
      tabManager.setActiveTab('tab3');
      tabManager.setActiveTab('tab1');
      tabManager.setActiveTab('tab1');

      expect(tabManager.activeTab).toBe('tab1');
    });

    it('should maintain proper tab indexing after multiple updates', () => {
      const initialTabs = [
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab2', title: 'Tab 2', content: 'Content 2' },
      ];

      const updatedTabs = [
        { id: 'tab3', title: 'Tab 3', content: 'Content 3' },
        { id: 'tab1', title: 'Tab 1', content: 'Content 1' },
        { id: 'tab4', title: 'Tab 4', content: 'Content 4' },
      ];

      const config: TabManagerConfig<TestTab> = {
        tabs: () => initialTabs,
      };

      const tabManager = new TabManager(config);

      // @ts-ignore
      const tabIndexesMap = tabManager.tabIndexesMap;

      expect(tabIndexesMap.get('tab1')).toBe(0);
      expect(tabIndexesMap.get('tab2')).toBe(1);

      tabManager.setTabs(updatedTabs);

      expect(tabIndexesMap.get('tab3')).toBe(0);
      expect(tabIndexesMap.get('tab1')).toBe(1);
      expect(tabIndexesMap.get('tab4')).toBe(2);
      expect(tabIndexesMap.get('tab2')).toBeUndefined();
    });
  });
});
