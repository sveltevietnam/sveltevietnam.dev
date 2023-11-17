import plugin from 'tailwindcss/plugin';

import { components } from '../components/index.js';
import { theme } from '../theme.js';
import { utilities } from '../utilities/index.js';

export default plugin(
  ({ addVariant, addComponents, addUtilities }) => {
    const dataCurrent = '&[data-current]:not([data-current="false"])';
    addVariant('data-current', dataCurrent);
    addVariant('aria-current', '&[aria-current]:not([aria-current="false"])');

    addComponents(components);
    addUtilities(utilities);
  },
  { theme },
);
