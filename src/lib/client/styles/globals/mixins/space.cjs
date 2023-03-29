const postcss = require('postcss');

/**
 * Add spacing between direct children
 * @param {import('postcss').Container<import('postcss').ChildNode>} mixin
 * @param {'x' | 'y'} axis
 * @param {string} value
 * @param {boolean} global
 */
function space(mixin, axis, value, global = false) {
  const parent = mixin.parent;

  const decl = postcss.decl({
    prop: axis === 'x' ? 'margin-left' : 'margin-top',
    value,
  });
  // maybe `> :not([hidden]) ~ :not([hidden])` is better ??
  let directChildSelector = global ? `:global(* + *)` : `* + *`;
  let nodeToAppend = parent;

  const grandparent = parent.parent;

  let selector = `& > ${directChildSelector}`;
  if (grandparent.type === 'atrule' && grandparent.name === 'media') {
    selector = `${parent.selector} > ${directChildSelector}`;
    nodeToAppend = grandparent;
  }

  nodeToAppend.append(
    postcss.rule({
      selector: selector,
      nodes: [decl],
    }),
  );
}

module.exports = { space };
