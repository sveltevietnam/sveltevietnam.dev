const { readFileSync } = require('fs');

const postcss = require('postcss');
const postcssJs = require('postcss-js');

require.extensions['.css'] = function (module, filename) {
  const css = readFileSync(filename, 'utf8');
  const root = postcss.parse(css);
  const jss = postcssJs.objectify(root);
  module.exports = jss;
};
