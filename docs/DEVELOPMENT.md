# Development Setup

> [!NOTE]
> Last updated on 2025-07-25

This document discusses necessary steps to get sveltevietnam.dev running on local development environment. Read [TECHNICAL REFERENCES] for an overview of the project's technical stack.

## Getting Help

For technical discussion or assistance, reach out to our maintainers at the [#site channel in Svelte Vietnam discord](https://discord.com/channels/1066621936546877450/1140975675235389562).

## Prerequisites

| Dependency | Installation                                                                     | Description                     |
| ---------- | -------------------------------------------------------------------------------- | ------------------------------- |
| [node]     | recommended via [volta]                                                          | JS runtime                      |
| [pnpm]     | [follow guide on website][pnpm.install], or see below if using volta             | alternative to `npm` and `yarn` |
| [lefthook] | [installation as OS binary][lefthook.install] is recommended, instead of via npm | git hooks manager               |

If you are using [volta] per recommendation above, you may find it easier to install [pnpm] via the volta toolchain:

```bash
volta install pnpm
```

See [package.json] for engine specification. At project root, run:

```bash
pnpm boot
```

> [!NOTE]
> The `boot` command runs all "boot steps" as defined in the `package.json` of each projects in the monorepo.
> That is, installing dependencies, generating types, setting up environment variables, etc.
> (For maintainers), to add a new boot step, simply add `boot:<new-step>` to the relevant `package.json`.

## Environment Variables

> [!NOTE]
> The `pnpm boot` command introduced in the previous section will automatically copy `.env` files for you.

Make sure you have the correct environment variables set up. For each project in the workspace, if you see an `.env.example` file, copy it to `.env` and your local dev server should work. For example:

```bash
cp sites/sveltevietnam.dev/.env.example sites/sveltevietnam.dev/.env
```

## Monorepo

This is a monorepo managed with [pnpm] workspace and [turborepo]. The internal projects are scoped as following:

- `/packages/*`: each project is a collection of code reusable across monorepo, and potentially publishable.
- `/services/*`: each project represent a service running in isolation (bot, backend domains, ...).
- `/sites/*`: each project represents an isolated domain.
- `/workers/*`: each project maintains a separate [Cloudflare worker][cloudflare.worker].

See [package.json at root directory](../package.json) and in each project for available npm scripts, and `README.md` in each project (if any) for additional instruction.

To run package-specific npm scripts, `cd` to package or use the `filter=...` flag at root. For example, to start the `sveltevietnam.dev` site, run:

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

A commit should strive to be:

1. atomic: have a descriptive message that hints at what the commit is about, exceptionally helpful for other contributors and PR reviewers.
2. encapsulated: represent a complete change, i.e a single feature, bug fix, or refactor that can make sense on its own.
3. executable: ideally capture a working state of the application / site. If not, it should be marked as `[WIP]` in its commit message.
4. minimal: span a limited scope and has as small of a footprint as possible. If a commit does too much or contains changes to many files, it is an indicator that the changes may be broken down into smaller commits.

Similarly, each pull request (PR) should work towards one issue or self-contained goal. The preference for merge strategy is as follow:

- if PR contains a single commit, `merge rebase` (fast-forward),
- if there are multiple commits and you want to keep the merge history, prefer `merge commit` over `squash`, unless there are dirty commits in the branch.

### Commit Message Guidelines

We follow the [Conventional Commits][conventionalcommits] guidelines for writing git commit message. Please familiarize yourself with the guidelines and be consistent.

```bash
[feat | fix | chore | ...](scope): "[message beginning with a verb: add | change | remove]"
```

### Code Style Enforcement

The project uses [eslint] and [prettier] for code linting and formatting. Make sure to install necessary plugins or integrations in your code editor.

[lefthook] is setup to run format and lint checks as a `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

> [!NOTE]
> To bypass hook (not recommended, for admin only), run `git commit` with the `--no-verify` flag.

## Handling Images

### Raster Images

Use [@sveltejs/enhanced-img](https://svelte.dev/docs/kit/images) to render raster images. Pay
special care the following for the source image:

- prefer compression format such as avif & webp,
- png vs jpg: prefer jpg, only use png for images with transparency,
- image size: use the smallest image possible that can cover all screen sizes,
- the image should be x2 of what is in the design, to support high-DPI screens.

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

---

<div>

<img src="https://raw.githubusercontent.com/sveltevietnam/branding/main/sveltevietnam-logo.png" width="56" height="56" align="left" />
<img align="left" width="0" height="192" hspace="2" vspace="2" />

When in doubt, reach out to community members, maintainers, or administrators!
<br/>
Most important of all, have fun!

</div>

<!-- LOCAL -->

[.vscode/extensions.json]: ../.vscode/extensions.json
[package.json]: ./package.json
[TECHNICAL REFERENCES]: ./TECHNICAL_REFERENCES.md

<!-- TECHNOLOGIES -->

[lefthook]: https://github.com/evilmartians/lefthook
[lefthook.install]: https://lefthook.dev/installation/
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[node]: https://nodejs.org/en/
[volta]: https://volta.sh/
[pnpm]: https://pnpm.io/
[pnpm.install]: https://pnpm.io/installation
[turborepo]: https://turbo.build/
[cloudflare.worker]: https://workers.cloudflare.com/

<!-- OTHERS -->

[conventionalcommits]: https://www.conventionalcommits.org/en/v1.0.0/
