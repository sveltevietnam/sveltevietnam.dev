# syntax = docker/dockerfile:1
ARG NODE_VERSION=18.16.0

#---------------------
# stage: base
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"
ENV NODE_ENV=production

WORKDIR /app

#---------------------
FROM base as builder

# PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=@services/discord --prod dist

# ---------------------
# stage: executor
FROM base
COPY --from=builder /app/dist /app

EXPOSE 5006
CMD [ "npm", "run", "start" ]

