const path = require('path');

const postcss = require('postcss');

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    /** @type {import('postcss-mixins').Options} */
    'postcss-mixins': {
      mixinsDir: path.resolve(__dirname, './src/lib/client/styles/mixins'),
      mixins: {
        /**
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
        dark: function (mixin, selector, global) {
          function createSelector(base, selector, global) {
            selector = selector ? ` ${selector}` : '';
            if (global) {
              return `:global(${base})${selector}`;
            }
            return `${base}${selector}`;
          }
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
        },
        /**
         * Add spacing between direct children
         * @param {'x' | 'y'} axis
         * @param {boolean} global
         */
        space: function (mixin, axis, value, global = false) {
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
        },
      },
    },
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV !== 'development' && { cssnano: {} }),
  },
};
