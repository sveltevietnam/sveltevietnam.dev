# Svelte Vietnam - Mailer Service

## Development

```bash
pnpm dev:wrangler
```

### Migrations

```bash
pnpm wrangler d1 migrations create sv_mailer_dev <migration_name>
pnpm wrangler d1 migrations list sv_mailer_dev --local
pnpm wrangler d1 migrations apply sv_mailer_dev --local
```

### Seeding for Development

```bash
pnpm wrangler d1 execute sv_mailer_dev --file d1/seed.sql --local
```
