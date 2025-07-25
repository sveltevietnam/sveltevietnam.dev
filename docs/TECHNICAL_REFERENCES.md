# Technical References

> [!NOTE]
> Last updated on 2025-07-25

This document outlines the key technical aspects of the `sveltevietnam.dev` project.

## Philosophy

Each technical decision is to be made with considerations of the following:

1. **Minimalism**: keep the system simple and easy to understand with only necessary components, modules, and abstraction layers.
2. **Scalability**: avoid potential technical debts; make good trade-off between consistency and flexibility. Avoid premature abstraction and predicting the future.
3. **Developer Experience**: use innovative and mature technologies, reduce development friction, write self-documented code. Focus on delivering value over over-engineering infrastructure.
4. **Performance**: deliver solutions that enable good end-user experience. Prefer functionality over decoration.

## Technical Stack

This section lists the current technical stack for the project. The stack is subject to change as the project evolves. Discussions are welcome.

### Infrastructure & Base Framework

- [cloudflare]: domain hosting, infrastructor provider for both frontend, backend, and database ([D1][cloudflare.d1])
- [pnpm]: package manager, alternative to [npm]
- [turborepo]: manage dependencies between projects in the monorepo
- [vite]: build tool & development server
- [svelte-kit]: fullstack metaframework

### Development Tooling & Workflow

- [lefthook]: pre-commit [git hook](https://git-scm.com/docs/githooks) for code commit sanity
- [eslint] & [prettier] & [stylelint]: linting & formatting tools

### Backend Specifics

- [wrangler][cloudflare.wrangler]: local development CLI for cloudflare services (pages, workers, D1, ...)

### Frontend Specifics

- [svelte]: the frontend framework (think [react] or [vue])
- [postcss]: CSS preprocessor (think Sass but more plugin-based & JS-friendly)
- [tailwindcss]: utility-first CSS framework (think Bootstrap but more performant & customizable)
- [animejs]: complex animation

Other transition, state management, routing solutions are provided first-party by [svelte] & [svelte-kit].

### Testing

We use [Vitest] and [Playwright] for testing.

## [Typescript] or Javascript?

> [!IMPORTANT]
> Prefer `JS` (preferably with [JSDocs]) for libraries and scripts, and `TS` for sites and applications.

Sites (`sites/...` in our case) typically already have a build step or at least some preprocessing before the dev server can serve modules to clients. `TS` in these cases provides good developer experience without much tradeoff. In libraries or shared packages, however, having `TS` will introduce complexity and friction to the development workflow because we would lose direct access to the source code and have to rely on dependencies around build & workflow setup. `JS` with [JSDocs] is usually sufficient.

## Where to Start?

Follow instructions from [DEVELOPMENT](./DEVELOPMENT.md) to get started.

[cloudflare]: https://www.cloudflare.com/
[cloudflare.d1]: https://developers.cloudflare.com/d1/
[cloudflare.wrangler]: https://developers.cloudflare.com/workers/wrangler/
[typescript]: https://www.typescriptlang.org
[svelte]: https://svelte.dev/
[svelte-kit]: https://kit.svelte.dev/
[postcss]: https://postcss.org/
[tailwindcss]: https://tailwindcss.com/
[vite]: https://vitejs.dev/
[vitest]: https://vitest.dev/
[playwright]: https://playwright.dev/
[lint-staged]: https://github.com/okonet/lint-staged
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[pnpm]: https://pnpm.io/
[npm]: https://github.com/npm
[stylelint]: https://stylelint.io/
[hygen]: https://www.hygen.io/
[react]: https://react.dev/
[vue]: https://vuejs.org/
[jsdocs]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[lefthook]: https://github.com/evilmartians/lefthook
[animejs]: https://animejs.com/
[turborepo]: https://turborepo.org/
