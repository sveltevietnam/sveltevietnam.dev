require('../postcss/css-node-loader.cjs');

const components = {
  ...require('./action-card.css'),
  ...require('./avatar.css'),
  ...require('./btn.css'),
  ...require('./container.css'),
  ...require('./graphic.css'),
  ...require('./input.css'),
  ...require('./link.css'),
  ...require('./page.css'),
  ...require('./sponsor.css'),
};

module.exports = { components };
