---
to: "<%= category === 'component' ? `css/components/c-${name}.css` : null %>"
unless_exists: true
---
.c-<%= name %> {
  /* ... */
}
