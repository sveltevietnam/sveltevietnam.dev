const { readFileSync } = require('fs');

const postcss = require('postcss');
const postcssJs = require('postcss-js');

const { globalData, mixins } = require('./plugins.cjs');

require.extensions['.css'] = function (module, filename) {
  const css = readFileSync(filename, 'utf8');
  const root = postcss.parse(css);
  // apply mixins & custom-selectors here so that
  // tailwind can pick up the correct selectors for intellisense
  const jss = postcssJs.sync([globalData, mixins, require('postcss-custom-selectors')])(
    postcssJs.objectify(root),
  );
  module.exports = jss;
};
