const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'MAPEO Core',
  tagline: 'The decentralized geo-database that powers Mapeo',
  url: 'https://core.mapeo.app',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'digidem', // Usually your GitHub org/user name.
  projectName: 'mapeo-core-docs', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'MAPEO Core',
      logo: {
        alt: 'MAPEO Core Logo',
        src: 'img/logo@2x.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'concepts/overview/what',
          position: 'left',
          label: 'Concepts',
        },
        {
          type: 'doc',
          docId: 'reference/reference',
          position: 'left',
          label: 'Reference',
        },
        {
          href: 'https://github.com/digidem/mapeo-core',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Concepts',
              to: '/docs/concepts/overview/what',
            },
            {
              label: 'Concepts',
              to: '/docs/concepts',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/mapeoapp',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/digidem/mapeo-core',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Digital Democracy, Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/digidem/mapeo-core-docs/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
