<script>
	import atomicDesignNightmareImage from '../images/atomic-design-nightmare.png?format=webp&imagetools';
	import templateBasedDevImage from '../images/template-based-development.png?format=webp&imagetools';
	import componentBasedDevImage from '../images/component-based-development.png?format=webp&imagetools';
	import atomicDesignComicImage from '../images/atomic-design-comic-en.png?format=webp&imagetools';
	import justChangingColorImage from '../images/just-changing-color-en.png?format=webp&imagetools';
	import networkTransferImage from '../images/network-transfer.png?format=webp&imagetools';
</script>

There are three parts to the "Styling Svelte Vietnam" blog series, listed below. You are reading the second one.

1. [Part I - TailwindCSS](/en/blog/20240125-styling-svelte-vietnam-part-i-tailwindcss)
2. [Part II - CSS Component](/en/blog/20240125-styling-svelte-vietnam-part-ii-css-components)
3. [Part III - Code Discovery &
   Portability](/en/blog/20240125-styling-svelte-vietnam-part-iii-code-discovery-portability)

---

In this post, I will share how *sveltevietnam.dev* reuse most of its core UI components with only CSS, reducing the unnecessary dependency on Javascript that has become too common in web projects today. If you are skeptical, I hope that through these examples, my reasoning can convince you of a different perspective for UI analysis and source code management.

## Javascript Component

Before frontend frameworks, people used to split HTML into multiple "templates". When needed, the server would glue them together, and fill in the data before sending off to browsers.

<figure>
	<img src={templateBasedDevImage} class="mx-auto max-w-full rounded" width="800" height="300" alt="header.template and footer.template are injected into page.html by server before sent to client" />
	<figcaption>Illustration 1: template-based development strategy</figcaption>
</figure>

These early solutions focus primarily on encapsulating HTML. To reuse Javascript or CSS, we would need to self-manage and inject appropriate `.js`, `.css` files where applicable. Although primitive, this simple approach helps separate responsibilities of the three pillar technologies HTML, CSS, and Javascript:

1. join HTML templates to define page structure,
2. if custom styling is needed, import necessary CSS files,
3. when interaction logic is needed, import necessary Javascript files.

Building upon these ideas, modern frontend frameworks provide far more sophisticated techniques for splitting and joining UI that also prove to be much more convenient for developers. The UI parts split out are referred to as "components". Frameworks help us encapsulate not only HTML but also CSS and Javascript in a local, relatively independent manner from one component to others. Javscript and CSS code splitting and injection are also handled automatically.

Solutions that today frameworks employ usually require Javascript within the framework, either for prerendering and server-side-rendering, or hydration and client-side-rendering. For this reason, I refer to these UI parts as "**Javascript component**".

<figure>
	<img src={componentBasedDevImage} class="mx-auto max-w-full rounded" width="840" height="253" alt="components together are rendered into pages with Javascript at build time, sent to clients, and enhanced by Javascript runtime from the framework" />
	<figcaption>Illustration 2: component-based development strategy</figcaption>
</figure>

As you can see, frontend development has gradually become more and more complex. The boundaries between fundamental technologies are not so clear anymore: Javascript is used now not only in interaction logic but also for tooling during development and server-side data processing (thanks to NodeJS). This is not necessarily a bad thing (depends on who you ask), but the consequence is that we sometimes become too dependent on Javascript and convoluted, arguably unnecessary, setup around it.

## Atomic design

How to analyze, design, and implement UI components is a hot topic. Someone once asked me why I don't hate anything, and said that everything I say sounds so vague, unopinionated, with no strong stance whatsoever. Well, there is one thing that often gives me nightmare, and that is "[Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)".

<div class="c-callout c-callout--info">

To be precise, I do not hate the "Atomic Design" thinking; it does help develop a good mental model when approaching UI design. It is the implementation that I despise. Brad Frost, author of Atomic Design, uses his theory to build design systems. In practice, however, in most if not all projects using Atomic Design that I have been part of, I see people abuse Atomic Design primarily for the purpose of organizing source code. In my book, this should be called "Atomic Development" rather than "Atomic Design".

</div>

"Component-first" thinking is the common theme in projects that apply Atomic Design. Everything is turned into a component, and organized into layers: atom -> molecule -> organism -> template -> and page. It is fair to say that this approach perfectly demonstrates the Javascript component era.

<figure>
	<img src={atomicDesignNightmareImage} class="mx-auto max-w-full rounded" width="600" height="400" alt="Atomic Design and ever so deep nesting layers" />
	<figcaption>Illustration 3: Atomic Design and its nesting cocoon, something that haunts me in my dreams</figcaption>
</figure>

For an example, let's look at how an `ArticleCard` component might be implemented:

```svelte title=ArticleCard.svelte
<ArticleCard>
	<Link to="/path/to/article">
		<Heading level="3">...</Heading>
	</Link>
	<Figure>
		<Figure.Image src="/path/to/image.png" width="400" height="400" alt="..." />
		<Figure.Caption>...</Figure.Caption>
	</Figure>
	<Description>...</Description>
</ArticleCard>
```

Very eye-pleasing is it not? It looks as if we were using a fancy full-fledged UI library. Taking a closer look, we would need **six child components** - `Link`, `Heading`, `Figure`, `Figure.Image`, `Figure.Caption`, `Description` - to implement this `ArticleCard` one. Notably, if you have worked with the web long enough, you can probably guess how `Link` is implemented:

```svelte title=Link.svelte
<script>
	export let to = '';
</script>

<a class="..." href={to}>
	<slot />
</a>
```

Or `Heading`:

```svelte title=Heading.svelte
<script>
	export let level;
</script>

{#if level === 1}
	<h1 class="..."><slot /></h1>
{:else if level === 2}
	<h2 class="..."><slot /></h2>
{:else if level === 3}
	<h3 class="..."><slot /></h3>
{:else if level === 4}
	<h4 class="..."><slot /></h4>
{:else if level === 5}
	<h5 class="..."><slot /></h5>
{:else if level === 6}
	<h6 class="..."><slot /></h6>
{:else}
	<!-- ??? -->
{/if}
```

Listed below are some questions that arise from the example above, based on my own experience as someone who asked or was asked similar questions when working with Atomic Design:

- Why does it look like these child components are just direct copy of vanilla HTML elements without any special added features?
- Why the `to` prop for `Link` and not `href`?

  <div class="c-callout c-callout--info">

  In the React ecosystem, you might have seen that [react-router `Link` component](https://reactrouter.com/en/main/components/link) uses `to`, while [NextJS `Link` component](https://nextjs.org/docs/pages/api-reference/components/link) uses `href`. Which one is (more) correct?

  </div>

- Should `Figure` be an atom, a molecule, or an organism?
- Why do `Figure.Image` and `Figure.Caption` need to be separate components and not just be inlined in `Figure`?
- Why don't we split `Heading` into `Heading1`, `Heading2`, or a more specific `ArticleCard.Heading`?
- ...

Let's say, in an imaginative but perhaps very common scenario, a designer steps in and demands that `Heading` in `ArticleCard` needs special color and line-height that no place else does. Maybe creating a new `Article.Heading` component is really the way to go. But should we make it out of a `h3` from scratch or overriding `Heading`?

<div class="grid grid-cols-1 tablet:grid-cols-2 gap-10">


<div>

Overriding `Heading`:

```svelte title=ArticleCardHeading.svelte
<Heading level="3" class="special">
	<slot />
</Heading>

<style>
	:global(.heading.special) {
		line-height: 3.14;
		color: pink;
	}
</style>
```

</div>

<div>

Creating from scratch with `h3`:

```svelte title=ArticleCardHeading.svelte
<h3>
	<slot />
<h3>

<style>
	h3 {
		line-height: 3.14;
		color: pink;
	}
</style>
```

</div>

</div>

One year later, a poor colleague needs `ArticleCardHeading` but, without reading its source code, has no idea what level it is, why it is not just a `Heading` but its own component. As the project proceeds, there will be dozens if not hundreds of components, most of which are used only once. In a brand new project, tech lead enthusiastically calls a meeting with ten devs for three hours to discuss how many components to create, which one is an organism/molecule/atom, ...

<figure>
	<img src={atomicDesignComicImage} class="mx-auto max-w-full rounded" width="800" height="645" alt="at first, making components is very cool, but after a while it becomes a depressive, soul-sucking task" />
	<figcaption>Illustration 4: a quick rundown of my experience with Atomic Design</figcaption>
</figure>

## What is Component?

Developers love the "separation of concerns" talk. In the previous example, HTML (structure) and CSS (style) are coupled tightly together. The fact that a piece of text is semantically an `h3`, and how it looks like, are two relatively independent "concerns". Why then do we package them into one component? If the requirement is that we must use `h3` but the style corresponds to `heading-2` in our design system, then we will have to come up with some monkeypatching clunky workaround on top of existing abstractions to satisfy new requirements, and, in the process of it, argue which is the right way to do so.

<figure>
	<img src={justChangingColorImage} class="mx-auto max-w-full rounded" width="800" height="491" alt="designer asks dev to change color of text just at one place. Dev asks designer to just kill them, that's easier" />
	<figcaption>Illustration 5: requirements can change daily. Abstraction? Not so much</figcaption>
</figure>

What is a component? For me, a component has two purposes, to organize source code from big chunks to smaller, more maintainable pieces, or to reuse. If the example above is for organization purpose, then it does a pretty bad job because each component only has a few lines, and it abstracts away basic HTML elements like `a`, `p`, `img`, as if we were rewriting the web. What about reuse? Not quite right also, because most components are used only once inside another component. What we need to reuse most of the time is really just CSS, while other attributes need to adapt depending on the context of the application.

You get the idea! Javascript component sometimes creates unnecessary abstraction layers, especially when Atomic Design is abused.

## CSS Component

How many divs or child components do you think are needed to implement the following UI?

<p class="c-callout c-callout--info">
  This box is used to highlight a text with additional contextual information via colors.
</p>

Here is its source code:

```svelte title="+page.svelte"
<p class="c-callout c-callout--info">
  This box [...] via colors.
</p>
```

Let's break it down: all styling needed for this UI is defined via `c-callout` and `c-callout--info` classes. You can see [the source code of `c-callout` here](https://github.com/sveltevietnam/sveltevietnam.dev/blob/31b7f3d8859943b42e691730b0df98e292964492/libs/ui/src/css/core/components/c-callout.css). I call `c-callout` a "**CSS component**", a presentational piece of UI that only requires CSS to be implemented.

No Javascript component `Callout.svelte` is needed here because there is no special constraint on markup (e.g. must be a `p` tag), and no additional interaction logic. All we need to package is the styling, and we have done so with CSS. Let's try to rewrite the `ArticleCard` component from the previous section with the same idea:

```svelte title=ArticleCard.svelte
<article>
  <a href="/path/to/article" class="c-link">
    <h3 class="c-text-h2">...</h3>
  </a>
  <figure class="c-figure c-figure--image">
    <img src="/path/to/image.png" width="400" height="400" alt="..." />
    <figcaption>...</figcaption>
  </figure>
  <p>...</p>
</article>
```

No more child components! All that are left are basic HTML elements, since reusable parts are already encapsulated in corresponding CSS components. Notice that, as we only need to abstract CSS, we have ensure separation of concerns for the heading element: it is styled as `h2` but semantically still `h3`:

```svelte
<h3 class="c-text-h2">...</h3>
```

For the `figure` element, we may even be able to further simplify `c-figure--image` by utilizing the new [:has](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) selector:

```css title="c-figure.css"
.c-figure {
  /* :::highlight */
  &:where(:has(img)) {
    /* c-callout--image */
  }
  /* ::: */
}
```

<div class="c-callout c-callout--info">

Noitce the usage of [:where](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) to control the
[specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) of this selector so that
it can be overridden depending on each specific use case. This is a common technique often seen in
CSS libraries. Today, this can be further simplified with [CSS layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) - a relatively new feature of modern CSS.

</div>

This "thinking in CSS" is absolutely **not** new and exactly how people used to do before frontend frameworks. As it turns out, the way people implemented UI more than a decade ago is still very much worth learning!

## A UI-dissecting Strategy

Here are some general principles at *sveltevietnam.dev* for splitting UI into components for reusability:

- A piece of UI is candidate for reusable component only if it is used at least three times ([Rule of Three](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming))).
- If the abstraction only requires CSS, make CSS component. Most of the basic UI components at *sveltevietnam.dev* are in fact CSS only: `c-text-...`, `c-btn`, `c-link`, `c-input`, `c-tag`, `c-loader`, ...
- If constraint on markup or special logic is needed, *consider* making Javascript component. Examples of this at *sveltevietnam.dev* are `Breadcrumbs`, `BlogPostListItem`, ...

By removing unnecessary abstraction layers, the source code of *sveltevietnam.dev* has become more concise, readable, maintainable, and flexible.

## Impact of Global CSS Component

<p class="text-right text-xs italic">
This section is added in April, 2024
</p>

CSS components are often declared within a global stylesheet. In TailwindCSS, for example, declaring `c-btn` to `@layer components` adds the CSS of `c-btn` to the build output, which is a single file that the browser has to load in the beginning regardless of the page user is visiting, or whether the page actually uses `c-btn`. This means as the total number of global CSS components increases, the page takes more time to load.

In reality, the total CSS transfer size often is much less than Javascript and can be even less than HTML. At the time of this writing, the very page you are reading needs to load: **69.8kB** HTML, **643kB** JS, and **37.2kB** CSS. There are a total of **21** CSS components, taking up **27%** of all loaded CSS - nearly **7** times less than HTML and **64** times less than JS.

<div class="text-sm italic">

Note that the numbers above are measured by Chrome devtool as seen in the "Network" tab.

</div>

<figure>
	<img src={networkTransferImage} class="mx-auto max-w-full rounded" width="600" height="531" alt="a bar chart" />
	<figcaption>Graph 1: network transfer size of HTML, CSS, and Javascript from this page, as of version 1.0.0-next.44 (#51ce8b40@1713563981331)</figcaption>
</figure>

That being said, you **do** need to stay aware of the impact of global CSS, and CSS components in particular, on the total number of resources that the page needs to load. You should consider declaring CSS components only for simple, highly reusable UI components.

## Closing

That is it for this part of the series. In summary, Javascript component is a convenient development approach but we should be aware of its benefits and drawbacks, taking into account the requirements and specifics of each piece of UI. Prioritize simplicity and avoid unnecessary abstraction. CSS has grown a lot over the years, let us try to utilize it and reduce dependency on Javascript!

In the next and last part, "[Styling Svelte Vietnam: Part III - Code Discovery & Portability](/en/blog/20240125-styling-svelte-vietnam-part-iii-code-discovery-portability)", I will connect Tailwind from the previous part with the CSS component mindset in this part, and explain in more detail how *sveltevietnam.dev* actually sets up CSS component. Join [Svelte Vietnam Discord](https://discord.sveltevietnam.dev) for further discussion. Thank you for reading!
