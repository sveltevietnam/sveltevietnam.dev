---
inject: true
to: "<%= category === 'component' ? 'src/lib/client/styles/components/index.cjs' : null %>"
after: HYGEN INJECTION MARKER
skip_if: <%= name %>
---
  ...require('./<%= name %>.css'),