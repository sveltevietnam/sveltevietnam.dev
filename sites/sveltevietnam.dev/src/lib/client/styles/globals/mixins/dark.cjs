const postcss = require('postcss');

/**
 * @param {string} base
 * @param {string} selector
 * @param {boolean} global
 * @returns
 */
function createSelector(base, selector, global) {
  selector = selector ? ` ${selector}` : '';
  if (global) {
    return `:global(${base})${selector}`;
  }
  return `${base}${selector}`;
}

/**
 * @param {import('postcss').Container<import('postcss').ChildNode>} mixin
 * @param {string} selector
 * @param {boolean} global
 *
 * @example
 *
 * default (selector is html)
 *
 * ```css
 * @mixin dark {
 *   something
 * }
 * ```
 *
 * with custom selector (appended as children to html)
 *
 * ```css
 * @mixin dark .selector {
 *   something
 * }
 * ```
 *
 * In context of svelte style tag, add second param `global`
 *
 * ```css
 * @mixin dark .selector, global {
 *   something
 * }
 * ```
 */
function dark(mixin, selector, global) {
  const plainRule = postcss.rule({
    selector: createSelector('html[data-color-scheme="dark"]', selector, global),
    nodes: mixin.nodes,
  });
  const mediaRule = postcss.atRule({
    name: 'media',
    params: '(prefers-color-scheme: dark)',
    nodes: [
      postcss.rule({
        selector: createSelector('html:not([data-color-scheme="light"])', selector, global),
        nodes: mixin.nodes,
      }),
    ],
  });
  mixin.replaceWith([plainRule, mediaRule]);
}

module.exports = { dark };
