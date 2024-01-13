---
inject: true
to: "src/lib/data/blog/posts.ts"
after: "HYGEN MARKER - POST"
skip_if: "<%= listing.alias %>,"
---
  <%= listing.alias %>,