const { globalData, mixins } = require('./src/lib/client/styles/postcss/plugins.cjs');

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting')(require('postcss-nesting')),
    globalData,
    mixins,
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV !== 'development' ? [require('cssnano')] : []),
  ],
};
