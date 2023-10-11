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
  },
  { theme },
);
