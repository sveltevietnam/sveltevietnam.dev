# Development Setup

> [!NOTE]
> Last updated on 2025-04-15

This document discusses necessary steps to get sveltevietnam.dev running on local development environment. Read [TECHNICAL REFERENCES] for an overview of the project's technical stack.

## Getting Help

For technical discussion or assistance, reach out to our maintainers at the [#site channel in Svelte Vietnam discord](https://discord.com/channels/1066621936546877450/1140975675235389562).

## Prerequisites

| Dependency | Installation                            | Description                     |
| ---------- | --------------------------------------- | ------------------------------- |
| [node]     | recommended via [volta]                 | JS runtime                      |
| [pnpm]     | [follow guide on website][pnpm.install] | alternative to `npm` and `yarn` |
| [lefthook] | [follow guide at repo][lefthook]        | git hooks manager               |

See [package.json] for engine specification. At project root, run:

```bash
pnpm boot
```

## Environment Variables

Make sure you have the correct environment variables set up. For each project in the workspace, if you see an `.env.example` file, copy it to `.env` and your local dev server should work.

```bash
cp sites/sveltevietnam.dev/.env.example sites/sveltevietnam.dev/.env
```

## Monorepo

This is a monorepo managed with [pnpm] workspace and [turborepo]. The internal projects are scoped as following:

- `/packages/*`: each project is a collection of code reusable across monorepo, and potentially publishable.
- `/services/*`: each project represent a service running in isolation (bot, backend domains, ...).
- `/sites/*`: each project represents an isolated domain.
- `/workers/*`: each project maintains a separate [Cloudflare worker][cloudflare.worker].

See [package.json at root directory](../package.json) and in each package for available npm scripts. To run package-specific npm scripts, `cd` to package or use the `filter=...` flag at root. For example, to start the `sveltevietnam.dev` site, run:

```bash
pnpm dev --filter=sveltevietnam.dev
# or
cd sites/sveltevietnam.dev && pnpm dev
```

## Recommended VSCode Extensions

If you use VSCode, search for `@recommended` in the "Extension" panel for quick installation (look for "Workspace Recommendations"). To extend the `@recommended` list, add the extension ID to the `extensions` array in [.vscode/extensions.json].

## Code standard

> [!IMPORTANT]
> Rules are to be broken. There will always be exceptions. The following guidelines are not set in stone, but rather a set of recommendations to help us work together more effectively.

### What is a Good Commit / Pull Request?

A commit should:

1. have a descriptive message that hints at what the commit is about, exceptionally helpful for other contributors and reviewers.
2. encapsulate a complete change, i.e a single feature, bug fix, or refactor that can make sense on its own.
3. ideally capture a working state of the application / site. If not, it should be marked as `[WIP]` in its commit message.
4. span a limited scope and has minimal footprint. If a commit does too much or contains changes to many files, it is an indicator that the changes may be broken down into smaller commits.

Similarly, each pull request (PR) should work towards one issue or self-contained goal. If your PR contains a single commit, `merge rebase` (fast-forward). If there are multiple commits and you want to keep the merge history, prefer `merge commit` over `squash`, unless there are dirty commits in the branch.

### Commit Message Guidelines

We follow the [Conventional Commits][conventionalcommits] guidelines for writing git commit message. Please familiarize yourself with the guidelines and be consistent.

```bash
[feat | fix | chore | ...](scope): "[message beginning with a verb: add | change | remove]"
```

### Code Style Enforcement

The project uses [eslint] and [prettier] for code linting and formatting. Make sure to install necessary plugins or integrations in your code editor.

[lefthook] is setup to run format and lint checks as a `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

To bypass hook (not recommended, for admin only), run `git commit` with the `--no-verify` flag.

## Handling Images

### Raster Images

Use [@sveltejs/enhanced-img](https://svelte.dev/docs/kit/images) to render raster images. Pay
special care the following for the source image:

- png vs jpg: prefer jpg, only use png for images with transparency,
- image size: use the smallest image possible that can cover all screen sizes,
- the image should be x2 of what is in the design,

Lazy load image when possible (typically for images "[below the fold](https://support.google.com/adsense/answer/4510803?hl=en)"), that is:

```html
<img src="..." alt="..." loading="lazy" fetchpriority="low" decoding="async" />
```

### SVGs

SVG downloaded from the web or exported from Figma can be optimized, sometimes to great extent, with
the following tools:

- [SVGOMG](https://svgomg.net/): for quick optimization
- [SVG Path Editor](https://yqnn.github.io/svg-path-editor/): for more advanced path editing
- [picosvg](https://github.com/googlefonts/picosvg): fore more advanced optimization, for example to
  convert/simplify fill-rule strategy

<!-- LOCAL -->

[.vscode/extensions.json]: ../.vscode/extensions.json
[package.json]: ./package.json
[TECHNICAL REFERENCES]: ./TECHNICAL_REFERENCES.md

<!-- TECHNOLOGIES -->

[lefthook]: https://github.com/evilmartians/lefthook
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[node]: https://nodejs.org/en/
[nvm]: https://github.com/nvm-sh/nvm
[volta]: https://volta.sh/
[pnpm]: https://pnpm.io/
[pnpm.install]: https://pnpm.io/installation
[turborepo]: https://turbo.build/
[cloudflare.worker]: https://workers.cloudflare.com/

<!-- OTHERS -->

[conventionalcommits]: https://www.conventionalcommits.org/en/v1.0.0/
