---
inject: true
to: "src/lib/data/events/index.ts"
before: "HYGEN MARKER - IMPORT"
skip_if: "import { event as <%= listing.alias %> }"
---
import { event as <%= listing.alias %> } from '<%= listing.path %>';