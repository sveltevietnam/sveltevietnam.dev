Today, I am still not convinced i18n is a "solved problem" in Svelte land. The two big
discussions "[i18n brainstorming][svelte.discussion.brainstorming]" and
"[Translations][svelte.discussion.translations]" are still open and receiving occasional comments;
new implementation ideas still pop up now and then. In agreement with [Rich Harris](https://bsky.app/profile/rich-harris.dev),
I believe Svelte and SvelteKit from the position of an opinionated framework should provide first-class
support for i18n. But until then, community experimentation will continue to pave the way forward.

Meanwhile, dual-language support at [sveltevietnam.dev](https://sveltevietnam.dev) has gone through multiple
iterations over the years. Recently, with the newly-introduced [async Svelte][svelte.await] and
[remote function][sveltekit.remote] heuristics, I revisited this problem space and improved upon
the existing solution, the findings of which I would like to share with you in this post.

## Presenting the Code

The solution introduced here is packaged as [@sveltevietnam/i18n].
You can try it out by following the instructions at [@sveltevietnam/i18n > README > Getting Started][@sveltevietnam/i18n.started].
In short, it allows the following locale format...

```yaml title=".../locales/en.yaml"
messages:
  just_string: Goodbye!
  some_html: '<strong>Welcome!</strong>'
  string_with_params: Hello {{name}}!
  input:
    # nested keys
    placeholder: Type something here...
  imports:
    from_local:
      '@import': ./path/to/another/locale.yaml
    from_alias:
      '@import': '$lib/components/my-component/locales/lang.yaml'
    from_package:
      '@import': '@design-system/another-component/locales/lang.yaml'
```

...and the following translation patterns:

```svelte title="src/routes/.../+page.svelte"
<script lang="ts">
  import { T, Context } from '@sveltevietnam/i18n';
  import * as m from '@sveltevietnam/i18n/generated/messages';

  import { importedCustomRemoteFunction } from './path/to/your/custom/function.remote';

  // expect Context.set or <Provider> somewhere up the tree, see README
  const { t, lang } = Context.get();
</script>

<!-- declarative T component -->
<T key="imports.from_package..." />
<T key="some_html" /> <!-- renders sanitized HTML -->
<T key="string_with_params" params={{ name: 'world' }} />

<!-- t function -->
<input placeholder={await t({ key: 'input.placeholder' })} />

<!-- specifying remote function strategy, similar interface for T or t -->
<T key="..." remote="query" />
<T key="..." remote="prerender" />
<T key="..." remote={importedCustomRemoteFunction} />

<!-- treeshakeable static messages -->
{m['just_string'](lang)}
{m['string_with_params'](lang, { name: 'world' })}
```

## Objectives and Disclaimer

I hate to give too much preamble, but it's important to set the right expectations before we proceed.
Firstly, [@sveltevietnam/i18n] was built to solve unique requirements for i18n
translations at sveltevietnam.dev, specific to Svelte & SvelteKit (instead of being framework-agnostic),
and not intended to compete or replace mainstream solutions out there.
If you are looking for a more well-known, feature-rich solution with existing support/tutorial from the
community, consider [wuchale.dev][wuchale], or [Paraglide][paraglide] from the Inlang team.

Secondly, async Svelte and remote function are still experimental. In effect, although
there are test cases to cover various scenarios, you may experience rough edges using this package.
My hope from this experimentation is to contribute to the ongoing i18n discussion and
perhaps help testing remote function in the wild.

With those out of the way, the primary objectives of [@sveltevietnam/i18n] are to
be:

1. **composable**: translation files can be defined across as many files as necessary, and co-located
  where they are used, i.e pages, components. This is done via the `@import` directive you see in
  the example above,
2. **type-safe**: keys and params are typed. This means all prop / parameter to `Context`, `T`, `t`,
  and static message functions should have Typescript support out of the box.
3. **flexible**: reasonable trade-off between ceremonial complexity and adaptability at runtime. This means
  providing `T` for declarative translation, `t` for more imperative usages, static messages when
  using outside of Svelte context (in backend, or isolated modules); also providing both ad-hoc
  lang and remote strategy override as well as global fallback.

<div class="c-callout c-callout--info">

[@sveltevietnam/i18n] is being used on this very page you are reading. You can inspect network
requests while switching between languages to see remote function in action, and how much
data is being transferred.

</div>

## Why Remote Function?

i18n loading consists of 2 main parts:

1. what collection of messages to load, and
2. what languages to load for each message.

From my experience, traditional i18n solutions would often either require you manually specify what to
load at page level, or automatically load everything upfront. As the project grows, it becomes
too cumbersome to manage manually, or too wasteful to just load everything. Paraglide's response
to this problem is to utilize ES module for per-message treeshaking, which seems to me like the
right direction. However, they are still not able to achieve per-lang loading yet (they're [actively
trying to](https://github.com/opral/inlang-paraglide-js/issues/88)).

I believe remote function has the potential to add another dimension to this problem.
Theoretically, loading messages via remote function means only load what you need, when you need it.
For example, the following page only loads the `hello` message in `en`:

```svelte title="src/routes/en/+page.svelte"
<script lang="ts">
  import { T } from '@sveltevietnam/i18n';
</script>

<T key="hello" />
```

<div class="c-callout c-callout--info">

Of course, complexity doesn't simply disappear, it only shifts from one abstraction to another.
In case of remote function, the client bundle is optimized, but server effectively needs to keep a
mapping of all the messages to return on demand. Plus, there is some overhead of making network requests
and data packets. How this fare against other solutions remains to be seen.

</div>

## What Remote Function to use?

The current implementation supports the use of either
[query.batch](https://svelte.dev/docs/kit/remote-functions#query.batch)
and [prerender](https://svelte.dev/docs/kit/remote-functions#prerender), globally or per message, via
the `remote` prop, as seen in [Presenting the Code](#presenting-the-code) section.

`query.batch` allows a single request to fetch multiple messages at once, which is great to avoid making
n+1 requests. However, such request is hard to cache, and `query` can't be used on prerendered
pages. `prerender`, on the other hand, enables caching at multiple level (CDN, browser), but right now each message
will fire off its own request.

<div class="c-callout c-callout--success c-callout--icon-bulb">

It would be great if there is a remote function strategy that is a marriage of both `query.batch`
and `prerender`, call it `prerender.batch`. I don't know, however, if such implementation makes
sense in practice.

</div>

The package also accepts a custom remote function if you want to implement your own. If you happen
to come up with a better strategy, I would love to hear about it!

## Vite Plugin and Code Generation

The bulk of the work that allows [@sveltevietnam/i18n] to function is done via its Vite plugin,
which collects all locale files at build time and emit ES modules for messages and metadata, which
then are imported and used by the runtime components and remote functions.

```typescript title="vite.config.ts"
import { sveltekit } from '@sveltejs/kit/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    i18n({
      // where your *entry* locale files live (en.yaml, vi.yaml, etc)
      input: './src/lib/i18n/locales',
      // where generated modules live, safe to add to .gitignore
      output: './src/lib/i18n/generated',
    }),
    sveltekit(),
  ],
});
```

For more information, See [@sveltevietnam/i18n > README > Output Modules][@sveltevietnam/i18n.output].

### Static Messages & Static Mode

Before "remote function", usage of [@sveltevietnam/i18n], similar to Paraglide, would rely on
static message functions that are generated at build time. If you are not able to turn on async and
remote function experimental features, you can still fall back to this so-called "static" mode
by specifying `mode: 'static'` as an option to the i18n Vite plugin.

In `static` mode, you'll have to import and pass in a generated static `message` instead of `key`.
Typescript interface should update accordingly to reflect this change.

```svelte title="Static Mode"
<script lang="ts">
  import { T, Context } from '@sveltevietnam/i18n';
  import * as m from '@sveltevietnam/i18n/generated/messages';
</script>

<!-- :::diff - -->
<T key="key.to.your.message" /> <!-- now reports type error -->
<!-- ::: -->
<!-- :::diff + -->
<T message={m['key.to.your.message']} />
<!-- ::: -->
```

## Composability

Apart from this package being developed independently before [Inlang](https://inlang.com/) and
[Wuchale](https://wuchale.dev) became as popular as they are today, a reason that's motivated me
to keep coming back to this problem space is the need to work with multiple locale files. I believe
this can greatly improve maintainability of translations as the project grows, as well as the
shareability of components when they are packaged, either as a project under a monorepo or a
standalone npm package.

Currently, as seen in [Presenting the Code](#presenting-the-code) section, locale files can import
others using the `@import` directive:

```yaml title=".../locales/en.yaml"
messages:
  from_local:
    '@import': ./path/to/another/locale.yaml
  from_alias:
    '@import': '$lib/components/my-component/locales/lang.yaml'
  from_package:
    '@import': '@design-system/another-component/locales/lang.yaml'
```

Customization for the directive and aliases is possible via options to the Vite plugin. You can
take advantage of intellisense and typescript definition to see what's available there.

I hope, in whatever solution Svelte eventually adopts, composability will be a first-class citizen.

## Beyond Translation

The scope of i18n is much broader than just translating texts, and often intersect in
venn diagram with other domains, the most prominent of which is routing, i.e URL localisation.
At sveltevietnam.dev, we have a [separate vite plugin](https://github.com/sveltevietnam/sveltevietnam.dev/blob/683f2281a1deec7f9d76ccf27dcfd5d252386f7e/packages/routes/src/vite.js)
to help address this problem and automate parts of the setup. However, it is very much still in
experimental stage and need much attention especially with the relatively new [resolve API](https://svelte.dev/docs/kit/$app-paths#resolve) from SvelteKit, and thus hasn't matured into a package or been integrated into
[@sveltevietnam/i18n] just yet.

In other areas of localisation, I'd like to remind readers that the [Intl standard object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
exists and is a great help for datetime, number, currency, list formatting, etc.

## Onwards

There are a lot of ideas I have in mind to improve [@sveltevietnam/i18n] further to support a
broader set of use cases, including:

- optimization of translation indexing on server in "remote" mode, perhaps via some wasm format
- encryption of translation in transit,
- a Vite plugin / Svelte preprocessor to statically analyze where a message is used,
  report usage and dead messages, or support live translation,
- a recommendation of testing strategy for i18n-related code, even though one can do so today in
  `vitest` by simply using the `i18n` vite plugin,
- benchmarking for real-world performance, across modes and remote function strategies.

## Closing

I hope this package can be helpful for your project, or at least add a small part to the ongoing
discussion. If you have ideas for improvements or encounter problems, feel free to [open an issue](https://github.com/sveltevietnam/sveltevietnam.dev/issues). I'm also available at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com) or via the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

Happy translating!

[@sveltevietnam/i18n]: https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n
[@sveltevietnam/i18n.started]: https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n#getting-started
[@sveltevietnam/i18n.output]: https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n#output-modules
[svelte.discussion.brainstorming]: https://github.com/sveltejs/kit/issues/553
[svelte.discussion.translations]: https://github.com/sveltejs/kit/issues/1274
[svelte.await]: https://svelte.dev/docs/svelte/await-expressions
[sveltekit.remote]: https://svelte.dev/docs/kit/remote-functions
[icu]: https://unicode-org.github.io/icu
[gettext]: https://www.gnu.org/software/gettext

[paraglide]: https://inlang.com/m/dxnzrydw/paraglide-sveltekit-i18n
[wuchale]: https://wuchale.dev
