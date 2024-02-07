---
to: "<%= category === 'component' ? `src/css/core/components/c-${name}.css` : null %>"
unless_exists: true
---
.c-<%= name %> {
  /* ... */
}
