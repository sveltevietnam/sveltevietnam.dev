---
inject: true
to: "<%= category === 'component' ? 'css/components/index.js' : null %>"
after: HYGEN INJECTION MARKER
skip_if: <%= name %>
---
  require('./c-<%= name %>.css'),