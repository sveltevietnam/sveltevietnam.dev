const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');

const sveltevietnam = plugin(
  ({ addVariant, addComponents, theme }) => {
    const dataCurrent = '&[data-current]:not([data-current="false"])';
    addVariant('data-current', dataCurrent);
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
        'padding-left': theme('spacing.6'),
        'padding-right': theme('spacing.6'),
        'margin-left': 'auto',
        'margin-right': 'auto',
        [`@media (min-width: ${theme('screens.md')})`]: {
          'padding-left': theme('spacing.8'),
          'padding-right': theme('spacing.8'),
        },
      },
      '.c-link': {
        '& :is(img, svg)': {
          transition: 'transform 200ms ease-in-out',
        },
        '&:hover': {
          // FIXME: put in primary color when there is one
          color: theme('colors.primary'),
          '& :is(img, svg)': {
            transform: 'scale(1.05)',
          },
        },
        '&:active': {
          '& :is(img, svg)': {
            transform: 'scale(0.95)',
          },
        },
        [dataCurrent]: {
          color: theme('colors.primary'),
        },
      },
      '* .c-link:not(:has(:is(img, svg))) ': {
        color: theme('colors.primary'),
        '&:hover': {
          'text-decoration-line': 'underline',
        },
      },
      '.c-btn': {
        display: 'grid',
        'column-gap': theme('spacing.2'),
        padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
        'justify-content': 'center',
        'align-items': 'center',
        'border-radius': theme('borderRadius.DEFAULT'),
        '&:has(:is(img, svg))': {
          'grid-template-columns': 'auto auto',
        },
        '&:not(:has(:is(img, svg)))': {
          'text-align': 'center',
        },
        '&:where(:not([data-ctype])), &:where([data-ctype="default"])': {
          'background-color': theme('colors.bg.300'),
        },
        '&:where([data-ctype="outlined"])': {
          border: `1px solid ${theme('colors.bg.300')}`,
        },
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
          primary: '#ef4623',
          svelte: '#ef4623',
        },
        zIndex: {
          px: '1',
          modal: '80', // a modal/dialog
          // sidebar: '92', // sidebar
          // float: '100', // floating buttons and such
          popup: '120', // tooltip, dropdown, popover etc
          overlay: '150', // a full screen overlay
          // command: '200', // command palette
          // notification: '300', // notification
        },
      },
    },
  },
);

/** @type {import("tailwindcss").Config } */
const config = {
  darkMode: '',
  content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
  plugins: [require('@tailwindash/triangle'), sveltevietnam],
};

module.exports = config;
