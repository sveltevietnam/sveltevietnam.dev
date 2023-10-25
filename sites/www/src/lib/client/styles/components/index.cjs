require('../postcss/css-node-loader.cjs');

const components = {
  // HYGEN INJECTION MARKER
  ...require('./logo.css'),
  ...require('./tooltip.css'),
  ...require('./tag.css'),
  ...require('./loader.css'),
  ...require('./action-card.css'),
  ...require('./avatar.css'),
  ...require('./btn.css'),
  ...require('./container.css'),
  ...require('./graphic.css'),
  ...require('./input.css'),
  ...require('./link.css'),
  ...require('./page.css'),
  ...require('./sponsor.css'),
  ...require('./intro.css'),
};

module.exports = { components };
