---
to: "<%= category === 'component' ? `src/lib/client/styles/components/${name}.css` : null %>"
unless_exists: true
---
.c-<%= name %> {
  /* ... */
}
