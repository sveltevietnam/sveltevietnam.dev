Rendering icons is a reoccurring task in all web projects I have been part of. In the development
history of sveltevietnam.dev for the last three years, I have experimented with a few
solutions but none was satisfactory enough for my needs.

With recent developments of the modern web ecosystem, together with the V1 rewrite of sveltevietnam.dev,
I gave myself an excuse to revisit this problem space. At the time of this writing,
icons on this page are rendered using [Iconify] with [Tailwind V4][tailwind].
For cases where SVG is required, however, I'm sticking with [@svelte-put/inline-svg] still.

## TL;DR

For static, optimized icons, use [Iconify] with [Tailwind V4][tailwind]:

```bash
pnpm add -D @iconify-json/your-icon-set @iconify/tailwind4
```

```css title="Iconify + Tailwind V4"
@plugin '@iconify/tailwind4' {
	prefix: i;
	/* stylelint-disable-next-line property-no-unknown, order/properties-order  */
	override-only: true;
}

@utility i {
	@layer components {
		display: inline-block;

		width: 1em;
		height: 1em;

		color: inherit;
		vertical-align: text-bottom;

		background-color: currentcolor;

		mask-image: var(--svg);
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
	}
}
```

For other use cases, use [@svelte-put/inline-svg].

## Strategy for Rendering Static Icons

### CSS Icon

There are many ways to display icons, such as icon fonts (e.g.
[Font Awesome](https://fontawesome.com/)), using SVG files directly, or through the `<img>` tag.
The solution presented in this article uses CSS and displays icons through
[mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) (and sometimes
[background-image](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image)).

The following shows the base CSS for icons displayed at sveltevietnam.dev:

```css title="CSS icon"
.i {
  display: inline-block;

  width: 1em;
  height: 1em;

  color: inherit;
  vertical-align: text-bottom;

  background-color: currentcolor;

  /* :::highlight */
  mask-image: var(--svg);
  /* ::: */
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
```

I won't go into details about this solution. You can refer to [Anthony Fu's "Icons in Pure CSS"
article](https://antfu.me/posts/icons-in-pure-css) for a more in-depth discussion.

### SVG in CSS

In the above code, let's focus on this line:

```css
  mask-image: var(--svg);
```

`--svg` is the [CSS variable](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) that I need to replace with the desired icon:

```css title="SVG-in-CSS"
.i-\[identifier\] {
  --svg: url("data:image/svg+xml,encoded-svg");
}
```

Where `identifier` is the name of the icon, and `encoded-svg` is the encoded text of the SVG to be
displayed (e.g. via the
[encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
function).

Theoretically, I can load any image resource through `url(...)`. However, for icons, SVG is often
embedded directly into CSS for several reasons:

1. SVG icons are often optimized to be small in size, so they won't significantly affect the CSS
   output size.
2. Using SVG instead of [raster images](https://en.wikipedia.org/wiki/Raster_graphics) allows icons to
   be resized as needed.
3. Icons often play a more critical role in user interface than other images, so they need to be
   displayed promptly. If I load `url(...)` from a separate file, e.g. `/icons/link.svg`, the browser
   may delay loading this resource, leading to a certain delay before the icon is displayed on the page.

   Since CSS is processed synchronously, embedding SVG directly allows icons to be rendered immediately.

### Usage in Markup

In short, to display an icon, I need to apply the above two classes:

```html
<i class="i i--[identifier]"></i>
```

## Icon Management

### Iconify

The role of Iconify here is to provide a collection of SVG icons that I can use to replace the
`--svg` variable as described above. [Iconify] is an open-source library that aggregates many
popular icon sets. At sveltevietnam.dev, I only need to install the corresponding packages to use
two icon sets — [Phosphor](https://phosphoricons.com/) and [Simple Icons](https://simpleicons.org/):

```bash
pnpm add -D @iconify-json/ph @iconify-json/simple-icons
```

For example, to display the icon <i class="i i-[ph--cpu] h-5 w-5"></i> from the Phosphor set, I can
use:

```html
<i class="i i-[ph--cpu]"></i>
```

or to display the icon <i class="i i-[simple-icons--svelte] h-5 w-5"></i> from the Simple Icons set:

```html
<i class="i i-[simple-icons--svelte]"></i>
```

### Tailwind

The role of Tailwind is to help automate the generation of CSS for each icon **being used** in the project.
In the two examples above, `i-[ph--link]` and `i-[simple-icons--svelte]` will be detected by Tailwind
and added to the output CSS:

```css title="CSS Output"
.i-\[ph--link\] { --svg: url("data:image/svg+xml,...") }
.i-\[simple-icons--svelte\] { --svg: url("data:image/svg+xml,...") }
```

To integrate Iconify with Tailwind, I need to install the following package:

```bash
pnpm add -D @iconify/tailwind4
```

<div class="c-callout c-callout--info">

Note that I'm using Tailwind V4 in this article. If you're using an older version, please refer to
[Iconify's documentation](https://iconify.design/docs/usage/css/tailwind/) for more details.

</div>

Next, I need to add the following configuration to the input CSS — typically the file where you
include `@import 'tailwindcss'`, such as `app.css` or `global.css`:

```css title="Configuration for Iconify in Tailwind V4"
@plugin '@iconify/tailwind4' {
	prefix: i;
	/* stylelint-disable-next-line property-no-unknown, order/properties-order  */
	override-only: true;
}
```

If you are not using [Stylelint](https://stylelint.io/), safely ignore the
`stylelint-disable-next-line` line. There are various configuration options depending on your needs
and preferences, which you can [refer to this
documentation](https://iconify.design/docs/usage/css/tailwind/tailwind4/) for.

### Customize Icon Size and Color

Move the `.i` rule declaration presented in the ["CSS Icon"](#css-icon) section to the input CSS:

```css title="utility"
/* :::diff - */
.i {
/* ::: */
/* :::diff + */
@utility i {
  @layer components {
/* ::: */
    display: inline-block;
    /* ... truncated ... */
    mask-image: var(--svg);
    /* :::diff + */
  }
  /* ::: */
}
```

[@utility](https://tailwindcss.com/docs/functions-and-directives#utility-directive) is a Tailwind
directive to define utility classes. Additionally, `@layer components` makes use of [CSS
layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) to help us easily add additional
utility classes to customize how the icon is displayed. For example:

```html title="Example: Size and Color"
<i class="i i-[ph--cpu] h-5 w-5 text-blue-500"></i>
```

`h-5`, `w-5`, and `text-blue-500` rules belong to the `utilities` CSS layer, which has a higher
specificity than the `i` rule defined in the `utilities.components` layer. Thus, I can be sure
that the adhoc size and color will be applied correctly without worrying about the order of declaration
for these classes in the output CSS.

### Manual Definition

Sometimes, I need to display some custom icon that is not part of any available icon set in
Iconify. As an example, consider this <i class="i ia-3dots h-5 w-5"></i> icon:

```html title="ia-3dots.html"
<i class="i ia-3dots"></i>  <!-- a === animated -->
```

In this scenario, I can define a custom SVG-in-CSS directly as follows:

```css title="ia-3dots.css"
@utility ia-3dots {
	@layer icons {
		--svg: url('...');
	}
}
```

<div class="c-callout c-callout--info c-callout--icon-bulb">

Because identifier classes such as `ia-3dots` or `i-[ph--cpu]` only provide the `--svg` variable,
they can potentially be reused in other contexts. For example:

```svelte title="Reuse"
<div class="custom-ui i-[ph--cpu]"></div>
<style>
  .custom-ui {
    /* do something with --svg */
  }
</style>
```

</div>

### About the i-[...] Syntax

You may have noticed that I use the syntax `i-[ph--cpu]` instead of `i-ph--cpu`. The square brackets
indicate the use of the [arbitrary value](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
syntax from Tailwind. In this particular case, it allows me to use any icon from the installed icon sets while
helping Tailwind optimize its [language server](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/main/packages/tailwindcss-language-server)
by only loading the icons that are actually used on demand, rather than preloading all 1000+ icons into
memory.

## Displaying Icons via SVG

From time to time, I need icons to be rendered as SVGs. Examples include complex SVGs that need to
be reused or SVGs that include multiple colors. In these cases, I reach for the [@svelte-put/inline-svg] library.

```bash
pnpm add -D @svelte-put/inline-svg
```

I wrote this library to provide two solutions for two different scenarios: static vs dynamic SVG.

### Static SVGs

"Static" means that the SVG does not change and is defined at build/compile time. First, I need to
add some configuration to Vite:

```js title="vite.config.js"
// :::diff +
import path from 'path';
import { inlineSvg } from '@svelte-put/inline-svg/vite';
// :::
import { defineConfig } from 'vite';

export default defineConfig({
  // :::diff +
  inlineSvg([
    { directories: [path.resolve(__dirname, 'src/lib/assets/images/svg')]},
    { typedef: true },
  ]),
  // :::
  sveltekit(),
});
```

Now, I can start inlining SVGs in Svelte files. For example:

```svelte title="static.svelte"
<svg class="..." inline-src="custom">
  <!-- inlined from src/lib/assets/images/svg/custom.svg -->
</svg>

<svg class="..." inline-src="./images/relative.svg">
  <!-- inlined from tại ./images/relative.svg -->
</svg>
```

Please refer to the [library documentation](https://svelte-put.vnphanquang.com/docs/inline-svg)
for more details on how to use and configure to suit your needs.

### Dynamic SVGs

"Dynamic" means that the SVG can only be determined at runtime. For example, it may need to be
loaded from another site. In this case, `@svelte-put/inline-svg` provides a solution
via [Svelte action](https://svelte.dev/docs/svelte/use):

```svelte title="dynamic.svelte"
<script>
  import { inlineSvg } from '@svelte-put/inline-svg';
  const src = 'https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg';
</script>
<svg use:inlineSvg={src}></svg>
```

## Closing

I hope this post has been helpful. The Iconify+Tailwind solution presented here also has
an advantage of being flexible and independent of any UI framework, and thus can be resued
in other projects such as Vue, Astro, etc.

Any feedback or suggestion is much appreciated.
You can find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com)
or in the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).
Thank you for reading!

[tailwind]: https://tailwindcss.com/
[iconify]: https://iconify.design/
[@svelte-put/inline-svg]: https://svelte-put.vnphanquang.com/docs/inline-svg
