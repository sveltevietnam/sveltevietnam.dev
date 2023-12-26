---
inject: true
to: "src/lib/shared/data/blog/posts.ts"
after: "HYGEN MARKER - POST"
skip_if: "<%= listing.alias %>,"
---
  <%= listing.alias %>,