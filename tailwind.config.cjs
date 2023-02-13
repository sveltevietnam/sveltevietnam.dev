const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');

const sveltevietnam = plugin(
  ({ addVariant }) => {
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
