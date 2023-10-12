const sveltevietnam = require('./src/lib/client/styles/postcss/tailwind.cjs');

/** @type {import("tailwindcss").Config } */
const config = {
  theme: {
    extend: {
      typography: ({ theme }) => {
        return {
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.design.fg.1'),
              '--tw-prose-invert-body': theme('colors.design.fg.1'),
              'a:not(.heading-anchor)': {
                '@apply c-link': {},
                'text-decoration': 'none',
              },
            },
          },
        };
      },
    },
  },
  darkMode: '',
  content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
  plugins: [
    sveltevietnam,
    require('postcss-color-scheme/lib/tailwind'),
    require('@tailwindcss/typography'),
  ],
};

module.exports = config;
