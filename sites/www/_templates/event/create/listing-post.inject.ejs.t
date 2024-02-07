---
inject: true
to: "src/lib/data/events/index.ts"
after: "HYGEN MARKER - EVENT"
skip_if: "<%= listing.alias %>,"
---
  <%= listing.alias %>,