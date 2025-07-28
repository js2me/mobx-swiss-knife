import { defineConfig } from 'vitepress';

import path from 'path';
import fs from 'fs';

const { version, name: packageName, author, license } = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../package.json'),
    { encoding: 'utf-8' },
  ),
);

export default defineConfig({
  title: packageName.replace(/-/g, ' '),
  description: `${packageName.replace(/-/g, ' ')} documentation`,
  base: `/${packageName}/`,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `/${packageName}/logo.png` }],
  ],
  transformHead: ({ pageData, head }) => {
    head.push(['meta', { property: 'og:site_name', content: packageName }]);
    head.push(['meta', { property: 'og:title', content: pageData.title }]);
    if (pageData.description) {
      head.push(['meta', { property: 'og:description', content: pageData.description }]);   
    }
    head.push(['meta', { property: 'og:image', content: `https://${author}.github.io/${packageName}/logo.png` }]);

    return head
  },
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/getting-started' },
      {
        text: `v${version}`,
        items: [
          {
            items: [
              {
                text: `v${version}`,
                link: `https://github.com/${author}/${packageName}/releases/tag/v${version}`,
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

    footer: {
      message: `Released under the ${license} License.`,
      copyright: `Copyright © 2025-PRESENT ${author}`,
    },

    socialLinks: [
      { icon: 'github', link: `https://github.com/${author}/${packageName}` },
    ],
  },
});
