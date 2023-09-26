---
inject: true
to: "src/routes/[[lang=lang]]/blog/_page/data.ts"
after: "HYGEN MARKER - POST"
skip_if: "<%= listing.alias %>,"
---
  <%= listing.alias %>,