/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    '@csstools/postcss-global-data': {
      files: ['src/lib/client/styles/globals/custom-selectors.css'],
    },
    /** @type {import('postcss-mixins').Options} */
    'postcss-mixins': {
      mixins: require('./src/lib/client/styles/globals/mixins/index.cjs'),
    },
    tailwindcss: {},
    'postcss-custom-selectors': {},
    autoprefixer: {},
    ...(process.env.NODE_ENV !== 'development' && { cssnano: {} }),
  },
};
