# Svelte Vietnam - Discord Service

Run at monorepo root

```bash
docker build -f services/discord/Dockerfile -t sveltevietnam/dev .
```

```bash
docker run --rm --name sveltevietnam-discord --env-file services/discord/.env -p 5006:5006 sveltevietnam/dev
```
