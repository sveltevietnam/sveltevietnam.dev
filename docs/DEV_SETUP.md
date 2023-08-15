# Development Setup

This document discusses necessary steps to get sveltevietnam.dev running on local development environment.

## Getting Help

For technical discussion or assistance, reach out to our maintainers at the [#site channel in Svelte Vietnam discord](https://discord.com/channels/1066621936546877450/1140975675235389562).

## Prerequisites

| Dependency    | Installation                            | Description                     |
| ------------- | --------------------------------------- | ------------------------------- |
| [node] >= 18x | [nvm], or [volta]                       | recommended `volta`             |
| [pnpm]        | [follow guide on website][pnpm.install] | alternative to `npm` and `yarn` |

At project root, run:

```bash
pnpm setup
```

## Monorepo

This is a monorepo managed with [pnpm] workspace and [turborepo]. The internal projects are scoped as following:

- `/sites/*`: each project represents an isolated domain.
- `/services/*`: each project represent a service running in isolation (bot, backend domains, ...).
- `/libs/*`: each project is a collection of code reusable across monorepo.

See [package.json at root directory](./package.json) and in each project for available npm scripts. To run project-specific npm scripts, `cd` to project or use the `filter=...` flag at root. For example, to start the `sveltevietnam.dev` site, run:

```bash
pnpm dev --filter=@sites/www
# or
cd sites/www && pnpm dev
```

## Recommended VSCode Extensions

Search for `@recommended` in the Extension panel for quick installation (look for "Workspace Recommendations").

To extend the `@recommended` list, add the extension ID to the `extensions` array in [.vscode/extensions.json].

## Code standard

### Commit Guidelines

We follow the [Conventional Commits][conventionalcommits] guidelines for writing git commit message. Please familiarize yourself with the guidelines and be consistent.

Each commit encapsulates a complete change and ideally captures a **working state** of the application / site.

Each pull request (PR) should work towards one issue or self-contained goal.

### Code Style Enforcement

The project uses [eslint] and [prettier] for code linting and formatting. Make sure to install necessary plugins or integrations in your code editor.

[simple-git-hooks] & [lint-staged] is setup to run format and lint checks as a `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

To bypass hook (not recommended, for admin only), run `git commit` with the `--no-verify` flag.

<!-- LOCAL -->

[.vscode/extensions.json]: ./.vscode/extensions.json

<!-- TECHNOLOGIES -->

[simple-git-hooks]: https://github.com/toplenboren/simple-git-hooks
[lint-staged]: https://github.com/okonet/lint-staged
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[node]: https://nodejs.org/en/
[nvm]: https://github.com/nvm-sh/nvm
[volta]: https://volta.sh/
[pnpm]: https://pnpm.io/
[pnpm.install]: https://pnpm.io/installation
[turborepo]: https://turbo.build/

<!-- OTHERS -->

[conventionalcommits]: https://www.conventionalcommits.org/en/v1.0.0/
