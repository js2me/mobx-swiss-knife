import { defineDocsVitepressConfig } from "sborshik/vitepress";
import { ConfigsManager } from "sborshik/utils/configs-manager";

const configs = ConfigsManager.create("../")

export default defineDocsVitepressConfig(configs, {
  appearance: 'dark',
  createdYear: '2025',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/getting-started' },
      {
        text: `${configs.package.version}`,
        items: [
          {
            items: [
              {
                text: `${configs.package.version}`,
                link: `https://github.com/${configs.package.author}/${configs.package.name}/releases/tag/${configs.package.version}`,
              },
            ],
          },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting started', link: '/introduction/getting-started' },
        ],
      },
      {
        text: 'Tools',
        items: [
          { text: 'DatesComparator', link: '/tools/dates-comparator' },
          { text: 'FakerLoader', link: '/tools/faker-loader' },
          { text: 'ModelLoader', link: '/tools/model-loader' },
          { text: 'Paginator', link: '/tools/paginator' },
          { text: 'Socket', link: '/tools/socket' },
          { text: 'Stepper', link: '/tools/stepper' },
          { text: 'Storage', link: '/tools/storage' },
          { text: 'TabManager', link: '/tools/tab-manager' },
          {
            text: 'themes',
            items: [
              { text: 'TwoColorThemeStore', link: '/tools/themes/two-color-theme-store' },
            ]
          },
          { text: 'Ticker', link: '/tools/ticker' },
          { text: 'Time', link: '/tools/time' },
          { text: 'Timers', link: '/tools/timers' },
        ]
      }
    ],
  },
});
