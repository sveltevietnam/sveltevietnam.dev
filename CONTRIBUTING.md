# Contributing to [svelte-vietnam][github]

Thank you for stopping by. [svelte-vietnam][github] welcomes and appreciates your contribution.

## Reporting Issues

Before opening a new issue, [first search for existing issues][github.issues] to avoid duplications.

When you start working on an issue, make sure you are asked to be assigned to it.

### Bug Report

Please include as much details as possible:

- steps to reproduce,
- screenshots.

### Feature Request

If you have an idea and don't know where to start yet, consider [opening a discussion][github.discussions] first.

If you have a PR ready as your proposed implementation, you can [create an issue][github.issues] and a PR that references it.

## Development Setup

### Prerequisites

Tools & setup required to start development

| Dependency    | Installation                            | Description                     |
| ------------- | --------------------------------------- | ------------------------------- |
| [node] >= 16x | [nvm], or [volta]                       | recommended `volta`             |
| [pnpm]        | [follow guide on website][pnpm.install] | alternative to `npm` and `yarn` |

See [package.json] for available npm scripts. All can be run with `pnpm` without the `run` subcommand:

```bash
pnpm install
pnpm dev
pnpm preview
pnpm build
```

### Recommended VSCode Extensions

Search for `@recommended` in the Extension panel for quick installation (look for "Workspace Recommendations").

To extend the `@recommended` list, add the extension ID to the `extensions` array in [.vscode/extensions.json].

### Code standard

#### Commit Guidelines

We follow the [Conventional Commits][conventionalcommits] guidelines for writing git commit message. Please familiarize yourself with the guidelines and be consistent.

Each commit encapsulates a complete change and ideally captures a **working state** of the application / site.

Each pull request (PR) should work towards one issue or self-contained goal.

#### Code Style Enforcement

The project uses [eslint] and [prettier] for code linting and formatting. Make sure to install necessary plugins or integrations in your code editor.

[simple-git-hooks] & [lint-staged] is setup to run format and lint checks as a `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

To bypass hook (not recommended, for admin only), run `git commit` with the `--no-verify` flag.

<!-- GITHUB -->

[github]: https://github.com/sveltevietnam/sveltevietnam.dev
[github.issues]: https://github.com/sveltevietnam/sveltevietnam.dev/issues?q=
[github.issues.open]: https://github.com/sveltevietnam/sveltevietnam.dev/issues?q=is%3Aissue+is%3Aopen
[github.discussions]: https://github.com/sveltevietnam/sveltevietnam.dev/discussions

<!-- LOCAL -->

[package.json]: ./package.json
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

<!-- OTHERS -->

[conventionalcommits]: https://www.conventionalcommits.org/en/v1.0.0/
