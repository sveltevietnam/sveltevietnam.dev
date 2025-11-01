# @sveltevietnam/i18n

[![MIT][license.badge]][license] [![npm.badge]][npm]

A homebrew i18n solution for Svelte applications, built for type-safety, composability, and optimization,
by leveraging:

- [tree-shakeable](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) ES modules,
- [SvelteKit remote function][sveltekit.remote],
- [Vite Plugin API](https://vite.dev/guide/api-plugin)

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
			input: './src/lib/i18n/locales',
			output: './src/lib/i18n/generated',
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
> If you cannot enable the experimental features, you can still use the package in "static" mode.
> See [Remote vs Static Mode](#remote-vs-static-mode) for details.

### 4. Define Locales

Define your locale files as `<lang>.yaml` under the input folder you specified in the Vite config,
for example:

```
lib/
	i18n/
		locales/	  <- input folder
			en.yaml	  <- messages in English
			vi.yaml	  <- messages in Vietnamese
		generated/	  <- output folder
```

...with format as seen in [Introduction](#introduction):

```yaml
messages: ...
```

### 5. Configure I18N Provider

Configure the i18n provider where appropriate, e.g., in `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import { Provider } from '@sveltevietnam/i18n';
	import { type Language } from '@sveltevietnam/i18n/generated';

	let lang = $state<Language>('vi');

	// manage lang state as you see fit
	// change to lang will propagate to translations automatically
</script>

<Provider {lang}>... your app here ...</Provider>
```

## Translating Messages

There are several ways to translate your messages, and using `T` component is recommended whenever
possible.

### Using `T` Component

```svelte
<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
</script>

<T key="key.to.your.message" />
```

> [!NOTE]
> Typing should be inferred. If your message requires parameters, additional `params` prop is expected.

### Using `t` function from context

```svelte
<script lang="ts">
	import { Context } from '@sveltevietnam/i18n';

	const { t } = Context.get();
</script>

{await t({ key: 'key.to.your.message' })}
```

> [!IMPORTANT]
> A few things to note:
>
> - In the default "remote" mode, `t` is asynchronous (calls remote function internally).
> - You will need to handle html string yourself, i.e using {@html ...}.

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
you can import and use the generated messages directly:

```typescript
// in server, or isolated modules
import * as m from '$lib/i18n/generated/messages'; // or where you defined as output
const message = m['key.to.your.message'];
```

> [!NOTE]
> When importing static messages, always use wildcard (`* as m`) to facilitate tree-shaking.

## Remote vs Static Mode

### Remote Mode

By default, the package builds in `"remote"` mode and assumes you have enabled experimental features
as discussed in [Configure Svelte & SvelteKit](3-configure-svelte--sveltekit). This leverages
Svelte & SvelteKit capabilities for optimization. i.e translations are:

- lazily fetched only when and where needed,
- batched together to minimize network requests.

### Static Mode

In cases, however, you don't have access to those features, the package can still run in in `"static"` mode.
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
	import * as m from '$lib/i18n/generated/messages'; // or where you defined as output
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

## Why YAML?

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

[svelte.async]: https://svelte.dev/docs/svelte/await-expressions
[sveltekit.remote]: https://svelte.dev/docs/kit/remote-functions
[npm.badge]: https://img.shields.io/npm/v/@sveltevietnam/i18n?style=for-the-badge
[npm]: https://www.npmjs.com/package/@sveltevietnam/i18n
[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge
[license]: ./LICENSE
