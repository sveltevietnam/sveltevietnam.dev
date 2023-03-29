const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');

const { components } = require('../components/index.cjs');
const { theme } = require('../theme.cjs');

module.exports = plugin(
  ({ addVariant, addComponents, addUtilities }) => {
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

    addComponents(components);

    addUtilities({
      '.square': {
        'aspect-ratio': '1 / 1',
        'min-height': '0',
        'min-width': '0',
      },
    });
  },
  { theme },
);
