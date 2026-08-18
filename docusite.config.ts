import { defineConfig } from 'docusite';

export default defineConfig({
  packageJsonPath: '.',
  base: `/@{packageJson.name}/`,
  title: '@{packageJson.name}',
  description: '@{packageJson.description}',
  search: 'local',
  changelog: {
    src: './CHANGELOG.md',
  },
  github: 'https://github.com/@{packageJson.author}/@{packageJson.name}',
  colors: {
    light: ['#ff745b', '#0066f6', '#fb581f'],
    dark: ['#ffae77', '#3c8dff', '#fb681f'],
  },
  logos: {
    main: '/public/logo.png',
    banner: '/public/banner.png',
  },
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Introduction', link: '/introduction/getting-started' },
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
        { text: 'KeyboardHandler', link: '/tools/keyboard-handler' },
        { text: 'ModelLoader', link: '/tools/model-loader' },
        { text: 'Paginator', link: '/tools/paginator' },
        { text: 'Socket', link: '/tools/socket' },
        { text: 'Stepper', link: '/tools/stepper' },
        { text: 'Storage', link: '/tools/storage' },
        { text: 'TabManager', link: '/tools/tab-manager' },
        {
          text: 'Themes',
          items: [
            {
              text: 'TwoColorThemeStore',
              link: '/tools/themes/two-color-theme-store',
            },
          ],
        },
        { text: 'Ticker', link: '/tools/ticker' },
        { text: 'Time', link: '/tools/time' },
        { text: 'Timers', link: '/tools/timers' },
      ],
    },
  ],
});
