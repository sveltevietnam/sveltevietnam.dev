---
inject: true
to: "src/lib/data/blog/posts.ts"
before: "HYGEN MARKER - IMPORT"
skip_if: "import { post as <%= listing.alias %> }"
---
import { post as <%= listing.alias %> } from '<%= listing.path %>';