const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');

const sveltevietnam = plugin(
  ({ addVariant, addComponents, theme, addUtilities }) => {
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

    addUtilities({
      '.square': {
        'aspect-ratio': '1 / 1',
        'min-height': '0',
        'min-width': '0',
      },
    });

    addComponents({
      '.c-container': {
        'max-width': '1200px',
        'padding-left': theme('spacing.6'),
        'padding-right': theme('spacing.6'),
        'margin-left': 'auto',
        'margin-right': 'auto',
        '@screen md': {
          'padding-left': theme('spacing.8'),
          'padding-right': theme('spacing.8'),
        },
      },
      '.c-link': {
        '&:hover': {
          // FIXME: put in primary color when there is one
          color: theme('colors.svelte'),
        },
        // FIXME: can be refactor with `:has` when it is supported across browsers
        '&:where(.c-link--icon)': {
          '& :is(img, svg)': {
            transition: 'transform 200ms ease-in-out',
          },
          '&:hover': {
            '& :is(img, svg)': {
              transform: 'scale(1.05)',
            },
          },
          '&:active': {
            '& :is(img, svg)': {
              transform: 'scale(0.95)',
            },
          },
        },
        '&:where(:not(.c-link--icon))': {
          display: 'inline',
          transition: 'color 200ms ease-in-out',
          '--underline-color': 'currentColor',
          'background-image': `linear-gradient(to right, var(--underline-color), var(--underline-color))`,
          'background-repeat': 'no-repeat',
          'background-position': 'left bottom',
          'background-size': '100% 1px',
          'will-change': 'background-size',
          '@keyframes underline-swipe': {
            '0%': {
              'background-position': 'right bottom',
              'background-size': '100% 1px',
            },
            '50%': {
              'background-position': 'right bottom',
              'background-size': '0 1px',
            },
            '51%': {
              'background-position': 'left bottom',
              'background-size': '0 1px',
            },
            '100%': {
              'background-position': 'left bottom',
              'background-size': '100% 1px',
            },
          },
          '&:hover': {
            animation: 'underline-swipe 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) 0s',
          },
        },
        [dataCurrent]: {
          color: theme('colors.svelte'),
        },
      },
      '.c-btn': {
        display: 'grid',
        'column-gap': theme('spacing.2'),
        padding: `0 ${theme('spacing.3')}`,
        'min-height': '40px',
        'justify-content': 'center',
        'align-items': 'center',
        'border-radius': theme('borderRadius.DEFAULT'),
        '&:where(:has(:is(img, svg)))': {
          'grid-template-columns': 'auto auto',
        },
        '&:where(not(:has(:is(img, svg))))': {
          'text-align': 'center',
        },
        '&:where(:not(:is(.c-btn--outlined, .c-btn--text))), &:where(.c-btn--default)': {
          'background-color': theme('colors.bg.300'),
          'white-space': 'nowrap',
        },
        '&:where(.c-btn--outlined)': {
          border: `1px solid ${theme('colors.bg.300')}`,
        },
        '&:where(.c-btn--text)': {
          position: 'relative',
          padding: `0 0 ${theme('spacing.1')}`,
          'font-weight': theme('fontWeight.medium'),
          '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: '100%',
            left: '0',
            width: '100%',
            height: 1,
            background: theme('colors.fg.200'),
            transition: `transform 250ms ${theme('transitionTimingFunction.DEFAULT')}`,
            'transform-origin': 'right center',
            transform: 'scaleX(0)',
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
            'transform-origin': 'left center',
          },
        },
      },

      '.c-graphic': {
        'aspect-ratio': '1 / 1',
        'min-width': '120px',
        'min-height': '120px',
        'background-color': theme('colors.bg.300'),
        'border-radius': theme('borderRadius.DEFAULT'),
      },

      '.c-avatar': {
        'aspect-ratio': '1 / 1',
        'min-width': '40px',
        'min-height': '40px',
        'background-color': theme('colors.bg.300'),
        'border-radius': theme('borderRadius.full'),
      },

      '.c-sponsor': {
        'min-height': '40px',
        width: 'auto',
        'background-color': theme('colors.bg.300'),
        'border-radius': theme('borderRadius.DEFAULT'),
      },

      '.c-input': {
        padding: `0 ${theme('spacing.3')}`,
        height: '40px',
        'border-radius': theme('borderRadius.DEFAULT'),
        'min-width': 0,
        width: '100%',
        'background-color': 'transparent',
        border: `1px solid ${theme('colors.fg.200')}`,
        '&:focus': {
          outline: `1px solid ${theme('colors.fg.200')}`,
        },
        '&:invalid:not(:placeholder-shown)': {
          'border-color': `${theme('colors.status.error')}`,
        },
      },

      // page level components
      '.c-page': {
        '@apply c-container': {},
        display: 'grid',
        'row-gap': theme('spacing.10'),
        'padding-bottom': theme('spacing.20'),
        '@screen md': {
          'row-gap': theme('spacing.20'),
        },
      },
      '.c-page\\@header': {
        '@apply space-y-6': {},
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'center',
        'align-items': 'center',
        height: '600px',
        'text-align': 'center',
      },
      '.c-page\\@h1': {
        'font-size': theme('fontSize.6xl'),
        'font-weight': theme('fontWeight.bold'),
        'text-transform': 'uppercase',
      },
      '.c-page\\@h1-sub': {
        'font-size': '32px',
      },
      '.c-page\\@h2': {
        'font-size': '32px',
        'font-weight': theme('fontWeight.bold'),
      },

      // action card
      '.c-action-card': {
        display: 'grid',
        'grid-template-columns': '1fr',
        'grid-auto-rows': 'min-content',
        gap: theme('spacing.6'),
        'justify-content': 'center',
        'justify-items': 'center',
        padding: theme('spacing.6'),
        'background-color': theme('colors.bg.200'),
        'border-radius': theme('borderRadius.DEFAULT'),
        '@screen md': {
          padding: theme('spacing.10'),
        },
      },
      ':where(.c-action-card > p)': {
        'text-align': 'center',
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
          header: '50', // root header
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
