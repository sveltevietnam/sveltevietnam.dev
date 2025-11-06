# @sveltevietnam/i18n

[![MIT][license.badge]][license] [![npm.badge]][npm]

A homebrew i18n solution for Svelte applications, built for type-safety, composability, and optimization,
by leveraging:

- [SvelteKit remote function][sveltekit.remote],
- [Vite Plugin API](https://vite.dev/guide/api-plugin),
- [tree-shakeable](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) ES modules.

See more in the "[Internationalisation with Remote Function — A Proof of Concept](https://sveltevietnam.dev/en/blog/20251105-internationalisation-with-remote-function-a-proof-of-concept)" blog post.

## Changelog

See [CHANGELOG.md](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/packages/i18n/CHANGELOG.md).

## Introduction

This package allows the following pattern:

```yaml
messages:
  just_string: Goodbye!
  some_html: '<strong>Welcome!</strong>'
  string_with_params: Hello {{name}}!
  nested:
    message: This is a nested message.
  imports:
    from_local:
      '@import': ./path/to/another/locale.yaml
    from_alias:
      '@import': '$lib/components/my-component/locales/lang.yaml'
    from_package:
      '@import': '@design-system/another-component/locales/lang.yaml'
```

```svelte
<script>
	import { T } from '@sveltevietnam/i18n';
</script>

<!-- type safe -->
<T key="some_html" />
<T key="string_with_params" params={{ name: 'world' }} />
<T key="nested.message" />
```

and more...

## Getting Started

### 1. Install Dependencies

```bash
npm install --save-dev @sveltevietnam/i18n
yarn add --dev @sveltevietnam/i18n
pnpm add -D @sveltevietnam/i18n
```

### 2. Use the Vite Plugin

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		i18n({
			input: './src/lib/i18n/locales', // where your locale files live (en.yaml, vi.yaml, etc)
			output: './src/lib/i18n/generated', // where generated modules live
		}),
		sveltekit(),
	],
});
```

### 3. Configure Svelte & SvelteKit

Turn on experimental [Async Svelte][svelte.async] and [SvelteKit remote function][sveltekit.remote], if your setup allows so

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
		},
	},
};
```

> [!NOTE]
> If you cannot use above experimental features, you can still use the package in "static" mode.
> See [Remote vs Static Mode](#remote-vs-static-mode) for details.

### 4. Define Locales

Define your locale files as `<lang>.yaml` under the input folder you specified in the Vite config,
for example:

```
lib/
	i18n/
		locales/			<- input folder
			en.yaml			<- messages in English
			vi.yaml			<- messages in Vietnamese
		generated/	  <- output folder
```

...with format as seen in [Introduction](#introduction):

```yaml
messages: ...
```

### 5. Configure I18N Provider

Configure i18n provider where appropriate, e.g., in `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import { Provider } from '@sveltevietnam/i18n';
	import { type Language } from '@sveltevietnam/i18n/generated';

	let lang = $state<Language>('vi');

	// manage lang state as you see fit
	// change to lang will propagate to translations automatically
</script>

<Provider {lang} remote="prerender">... your app here ...</Provider>
```

> [!NOTE]
> See "[Choose your Remote Function](#choose-your-remote-function)" for more details on how to specify the `remote` prop.

## Translating Messages

There are several ways to translate your messages, and using `T` component is **recommended whenever
possible**.

### Using `T` Component

```svelte
<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
</script>

<T key="key.to.your.message" />
```

> [!NOTE]
> Typing should be inferred. If your message specs contains parameters, additional `params` prop is expected.

### Using `t` function from context

Internally, `T` component uses a `t` function from the i18n context, which you also have access to:

```svelte
<script lang="ts">
	import { Context } from '@sveltevietnam/i18n';

	const { t } = Context.get();
</script>

{await t({ key: 'key.to.your.message' })}
```

The interface of `t` input mirrors that of `T` prop:

> [!IMPORTANT]
> A few things to note:
>
> - In the default ["remote" mode](#remote-mode), `t` is asynchronous (calls remote function internally).
> - You will need to handle html string yourself, i.e using `{@html ...}`.

This is helpful when you are translating non-html messages for attributes, e.g.,

```svelte
<dialog aria-label={await t({ key: 'key.to.your.message' })}></dialog>
<!-- or -->
<input placeholder={await t({ key: 'key.to.your.message' })} />
```

In case of `dialog` in the above example, alternatively, you can still use `T` component with
[aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby)
`T` component can sill be used.

### Overriding Lang

Both `T` component and `t` function accept an optional `lang` parameter in case you need to
override the current language from context.

```svelte
<T key="key.to.your.message" lang="en" />
{await t({ key: 'key.to.your.message', lang: 'en' })}
```

### Using Static Messages

Sometimes translation happens outside of i18n context for `T` and `t`, in which case
you can import and use the generated static messages directly:

```typescript
// in server, or some isolated modules
import * as m from '@sveltevietnam/i18n/generated/messages';
const message = m['key.to.your.message'];
```

> [!NOTE]
> When importing static messages, use the wildcard import syntax (`* as m`) to better facilitate tree-shaking.

### Using Remote Functions

In ["remote" mode](#remote-mode), `t` internally calls the generated remote function, which you can also import and
use directly:

```typescript
import { query, prerender } from '@sveltevietnam/i18n/generated/t.remote';

const translated = await query({
	// or prerender
	lang: 'en',
	key: 'string_with_params',
	params: { name: 'world' }, // inferred from key
});
```

Similar to `t`, you will need to handle html string yourself.

## Choose your Remote Function

In ["remote" mode](#remote-mode), `Provider`, `T`, and `t` accept a `remote` parameter (required on
provider) that specifies which remote function to fetch translation from. `remote` can be:

- `prerender`: uses SvelteKit [prerender](https://svelte.dev/docs/kit/remote-functions#query.batch)
  via the generated `prerender` function at `<output-dir>/t.remote.js`. This is usually what you want
  if you've turned on `prerendering` for your page(s),
- `query`: uses SvelteKit [query.batch](svelte.dev/docs/kit/remote-functions#query.batch) via the
  generated `query` function at `<output-dir>/t.remote.js`. This can batch multiple translation
  requests but may not be able to utilize cache,
- your own: import yours from some `.remote.{js,ts}` and pass it here to provide an implementation
  that works for your setup. The generated modules are at your disposal.

### Global Remote Function

```svelte
<script lang="ts">
	import { Provider } from '@sveltevietnam/i18n';
	let lang = $state<Language>('vi');
</script>

<Provider {lang} remote="prerender">
	<!--
		unless specified otherwise, all children T and t will fetch from
		import('@sveltevietnam/i18n/generated/t.remote').prerender
	-->
</Provider>
```

> [!NOTE]
> Context may also be set programmatically via the imported Context class, i.e `Context.set`.

### Remote Function per Translation

```svelte
<script lang="ts">
	import { T, Context } from '@sveltevietnam/i18n';
	const { t } = Context.get();
</script>

<!-- these use whatever remote function specified in provider -->
<T key="key.to.message" />
{await t({ key: 'key.to.message' })}

<!-- these overrides to use prerender function -->
<T key="key.to.message" remote="query" />
{await t({ key: 'key.to.message', remote: 'query' })}
```

## Remote vs Static Mode

### Remote Mode

By default, the package builds in `"remote"` mode and assumes you have enabled experimental features
as discussed in [Configure Svelte & SvelteKit](3-configure-svelte--sveltekit). This leverages
Svelte & SvelteKit capabilities for optimization. i.e translations are lazily fetched only when and where needed.

### Static Mode

In cases, however, you don't have access to those features, the package can still run in `"static"` mode.
This also helps if your project is not using SvelteKit (assuming Svelte+Vite).

Start by passing `mode: 'static'` to vite plugin config:

```js
// ...truncated...
i18n({
	mode: 'static',
});
// ...truncated...
```

The interface of `T` component changes in static mode. You will need to pass in static messages
from the generated modules instead:

```svelte
<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import * as m from '@sveltevietnam/i18n/generated/messages'; // or where you defined as output
</script>

<T message={m['key.to.your.message']} />
```

Similar restrictions apply to `t` function from context.

## HTML Sanitization

Both `T` component and `t` function perform HTML sanitization by default,
using [sanitize-html](https://www.npmjs.com/package/sanitize-html), and will strip all attributes
except `id`, `class` and `data-*`, or `href`, `target`, and `rel` for `a` anchor tags.

Customization is permissible via the `sanitize` parameter to `Provider`, `T` component, or `t` function.

```svelte
<Provider sanitize={customSanitize}>...</Provider>
<T key="key.to.message" sanitize={customSanitize} />
{t({ key: 'key.to.message', sanitize: customSanitize })}
```

## Output Modules

When running the Vite plugin, the `output` option specifies the directory that will host the
following modules:

```tree
<output>/				<- e.g. ./src/lib/i18n/generated
	messages/
    index.js
		[lang].js
	i18n.d.ts
	constants.js
  t.remote.js
```

- `messages/[lang].js`: each contain language-specific "message targets".
- `messages/index.js`: contains static "messages".
  This is the module that `@sveltevietnam/i18n/generated/messages` aliases to.
  See [Using Static Messages](#using-static-messages) for some more information.
- `constants.js`: contains some helpful constants like languages, keys, current mode,
  can be imported as `@sveltevietnam/i18n/generated/constants`.
  See [Using Remote Functions](#using-remote-functions) for some more information.
- `i18n.d.ts`: module augmentation for on-demand typing support.
- `t.remote.js`: contains the remote functions for translation,
  can be imported from `@sveltevietnam/i18n/generated/t.remote`.

Although importing from `@sveltevietnam/i18n/generated` is most convenient, you can also opt to
import directly from the output directory. For example, in SvelteKit, that may look like:

```typescript
import { langs } from '$lib/i18n/generated/constants';
import * as m from '$lib/i18n/generated/messages';
import { query } from '$lib/i18n/generated/t.remote';
```

This is helpful if you are reusing code in non-vite context, e.g. in Playwright tests.

## Composability

Locale files can import other locale files via the special `@import` directive, as seen in
[Introduction](#introduction). This allows you to break down your locale files into smaller,
manageable pieces, and even reuse locale files from other packages.

> [!IMPORTANT]
> The `@sveltevietnam/i18n` Vite plugin, however, expects a single entry locale file per language.
> Using multiple instances of the plugin is feasible but not recommended as type augmentation
> may not work as expected. If you do this, proceed with caution.

Import aliases inherit from other vite plugins including `$lib` from SvelteKit or others you've
configured in `svelte.config.js`. Customization is possible via option to the `i18n` vite plugin.

### Why YAML?

This package was originally built to facilitate internationalization for the
[sveltevietnam.dev](https://sveltevietnam.dev) site, which has not yet require complex features
such as pluralization. As such, `YAML` was chosen for simplicity,
i.e easy to read, easy to parse, compared to more sophisticated formats such as
[ICU](https://unicode-org.github.io/icu/userguide/format_parse/messages/) or
[GNU gettext](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html).

This may change in future releases. Contributions and discussions are welcome.

### Using JSON

You can customize the parser to accept JSON files instead:

```js
i18n({
	input: './src/lib/i18n/locales',
	output: './src/lib/i18n/generated',
	parseOptions: {
		deserializer: {
			parse: ({ content }) => JSON.parse(content),
		},
	},
});
```

Feedback and contributions are welcome. Start at [CONTRIBUTING.md](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/CONTRIBUTING.md).

[svelte.async]: https://svelte.dev/docs/svelte/await-expressions
[sveltekit.remote]: https://svelte.dev/docs/kit/remote-functions
[npm.badge]: https://img.shields.io/npm/v/@sveltevietnam/i18n?style=for-the-badge
[npm]: https://www.npmjs.com/package/@sveltevietnam/i18n
[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge
[license]: ./LICENSE
