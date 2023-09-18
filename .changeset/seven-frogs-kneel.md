---
'@services/mailer': patch
---

move binding `locals.d1` (hooks) to top, apply to all routes, but accept for when building (otherwise svelte kit will fail with 500 when trying to render 404 page)
