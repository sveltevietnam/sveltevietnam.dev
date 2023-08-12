require('../postcss/css-node-loader.cjs');

const utilities = {
  ...require('./utilities.css'),
  ...require('./typography.css'),
};

module.exports = { utilities };
