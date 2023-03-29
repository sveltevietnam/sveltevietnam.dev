const path = require('path');

const globalData = require('@csstools/postcss-global-data')({
  files: [path.join(__dirname, '../globals/custom-selectors.css')],
});
const mixins = require('postcss-mixins')({
  mixins: require('../globals/mixins/index.cjs'),
});

module.exports = { globalData, mixins };
