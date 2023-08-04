---
inject: true
to: "src/routes/[[lang=lang]]/(prototype)/blog/_page/data.ts"
before: "HYGEN MARKER - IMPORT"
skip_if: "import { post as <%= listing.alias %> }"
---
import { post as <%= listing.alias %> } from '<%= listing.path %>';