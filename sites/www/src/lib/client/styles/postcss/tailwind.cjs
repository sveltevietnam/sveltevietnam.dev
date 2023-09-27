const plugin = require('tailwindcss/plugin');

const { components } = require('../components/index.cjs');
const { theme } = require('../theme.cjs');
const { utilities } = require('../utilities/index.cjs');

module.exports = plugin(
  ({ addVariant, addComponents, addUtilities }) => {
    const dataCurrent = '&[data-current]:not([data-current="false"])';
    addVariant('data-current', dataCurrent);
    addVariant('aria-current', '&[aria-current]:not([aria-current="false"])');

    addComponents(components);
    addUtilities(utilities);

    addUtilities({
      '.square': {
        'aspect-ratio': '1 / 1',
        'min-height': '0',
        'min-width': '0',
      },
    });

    addUtilities({
      '.separator': {
        display: 'block',
        height: '1px',
        width: '100%',
        background: 'currentcolor',
        opacity: '20%',
      },
    });
  },
  { theme },
);
