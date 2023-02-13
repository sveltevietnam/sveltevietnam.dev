const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');

const sveltevietnam = plugin(
  ({ addVariant, addComponents, theme }) => {
    addVariant('data-current', '&[data-current]:not([data-current="false"])');
    addVariant('aria-current', '&[aria-current]:not([aria-current="false"])');
    addVariant('dark', [
      ':merge(html[data-color-scheme="dark"]) &',
      ({ container }) => {
        const originalRule = container.nodes[0];
        const mediaRule = postcss.atRule({
          name: 'media',
          params: '(prefers-color-scheme: dark)',
          nodes: [
            postcss.rule({
              selector: `html:not([data-color-scheme="light"]) ${originalRule.selector}`,
              nodes: originalRule.nodes,
            }),
          ],
        });
        container.removeAll();
        container.append(mediaRule);
      },
    ]);

    addComponents({
      '.c-container': {
        'max-width': '1200px',
        'padding-left': theme('spacing.8'),
        'padding-right': theme('spacing.8'),
        'margin-left': 'auto',
        'margin-right': 'auto',
      },
    });
  },
  {
    theme: {
      extend: {
        fontSize: {
          '2xs': '0.625rem',
        },
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
        spacing: {
          header: 'var(--header-height)',
        },
        colors: {
          status: {
            info: '#3ABFF8',
            success: '#36D399',
            warning: '#FBBD23',
            error: '#F87272',
          },
          grayscale: {
            light: {
              100: '#ffffff',
              200: '#E5E5E5',
              300: '#999999',
              400: '#4C4C4C',
            },
            dark: {
              100: '#1C1C1C',
              200: '#585757',
              300: '#969696',
              400: '#E8E8E8',
            },
          },
          fg: {
            100: 'var(--color-fg-100)',
            200: 'var(--color-fg-200)',
            300: 'var(--color-fg-300)',
            400: 'var(--color-fg-400)',
          },
          bg: {
            100: 'var(--color-bg-100)',
            200: 'var(--color-bg-200)',
            300: 'var(--color-bg-300)',
            400: 'var(--color-bg-400)',
          },
        },
      },
    },
  },
);

/** @type {import("tailwindcss").Config } */
const config = {
  darkMode: '',
  content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
  plugins: [sveltevietnam],
};

module.exports = config;
