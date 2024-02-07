---
inject: true
to: "<%= category === 'component' ? 'src/css/core/components/index.js' : null %>"
after: HYGEN INJECTION MARKER
skip_if: <%= name %>
---
  require('./c-<%= name %>.css'),