<script>
  import SectionCodeBlock from './code-block/en.md.svelte';
  import SectionCallout from './callout/en.md.svelte';
  import SectionImage from './image/en.md.svelte';
</script>

<h2 id="syntax">Post Content Syntax: Markdown + Svelte</h2>

Post content is parsed by a custom [Svelte
preprocessor](https://svelte.dev/docs/svelte/svelte-compiler#preprocess). Feel free to check out its
[source code](https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/markdown)
to learn more about its inner workings. In short:

- most of the content is written in [Github Flavored Markdown](https://github.github.com/gfm/) syntax,
- you can also use Svelte syntax such as `script` tag or other imported Svelte components,
- syntax highlighting for code blocks is handled by [Shiki](https://shiki.matsu.io/).

Several special syntax have been developed to make writing blog posts more convenient.
These special syntax are introduced in the next sections.

<div class="c-callout c-callout--info c-callout--icon-bulb">

The most natural way to get familiar with these special syntax is to refer to the source code of
published blog posts at the [Svelte Vietnam Blog](/en/blog).

Some Markdown or Svelte syntax may not work as expected, in which case please contact administrators
for possible workarounds.

</div>

<SectionCodeBlock />
<SectionImage />
<SectionCallout />

