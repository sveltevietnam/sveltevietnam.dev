<script>
  import clickoutsideImage from '../images/clickoutside.png?format=webp&imagetools';
  import sveltePreprocessorImage from '../images/svelte-preprocessor.png?format=webp&imagetools';
  import preprocessBlogImage from '../images/preprocess-blog.png?format=webp&imagetools';
  import Example from '../examples/example.md.svelte';
</script>

<div class="c-callout c-callout--info">

This is a complementary article for the talk **"Svelte, Javascript, and the Web"** given at the event "[Spring Meeting 2024 - Ho Chi Minh City](/en/events/202404-spring-ho-chi-minh-meetup)".

</div>

Svelte is a framework for building user interfaces on the web. If you haven't heard of Svelte or used it, I recommend you check out the famous talk "[Rethinking Reactivity](https://www.youtube.com/watch?v=AdNJ3fydeao)" by [Rich Harris](https://twitter.com/rich_harris), the author of Svelte. This video will give you an overview about Svelte and its fundamental difference compared to other frameworks.

In this post, I will provide two practical examples, through which we can somewhat see the differences in the API design of Svelte compared to other frameworks'. I have no intention of convincing you to abandon all the frameworks you are using and switch to Svelte, but I hope that, after reading this, you will agree that Svelte is a technology worth paying attention to.

## Web is the Framework

Imagine you are a web developer who has never heard of any framework, and your task is: to capture click events outside an element:

<figure class="shrink-0">
  <img src={clickoutsideImage} class="mx-auto max-w-full rounded" width="400" height="176" alt="illustration: when clicking outside an element, shown as a rectangle, a clickoutside event is emitted" />
  <figcaption>Illustration 1: a "clickoutside" event </figcaption>
</figure>

This is quite a common feature. Remember the last time you encountered a dialog window or a modal, and clicking outside it would close the window? That is "clickoutside". So, how would you implement this with **vanilla Javascript**? Here is one way:

```javascript title=clickoutside.js
export function clickoutside(node) {
  window.addEventLister('click', (event) => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  });
}
```

Note that, we dispatch a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) named `clickoutside` when a click occurs outside the `node` element. `CustomEvent` is a standard web API, not specific to any framework. The example above allows us to reuse it with any HTML element:

```html title=my-page.html
<script type="module">
  import { clickoutside } from 'clickoutside.js';

  // reference tot he element
  const node = document.getElementById('my-element');

  // set up the clickoutside event
  clickoutside(node);

  // :::focus
  // handle the clickoutside event
  node.addEventListner('clickoutside', () => { /* ... */ });
  // :::
</script>

<div id="my-element">...</div>
```

Simple enough? Now how would you do it with your favorite framework? The following is a Svelte version of `clickoutside`:

```svelte title=my-page.svelte
<script>
  import { clickoutside } from 'clickoutside.js';

  const handleClickOutside = () => { /* ... */ };
</script>

<!-- :::focus -->
<div
  id="my-element"
  use:clickoutside
  on:clickoutside={handleClickOutside}
>...</div>
<!-- ::: -->
```

Wait a second! What is `clickoutside` here? Well, it is exactly the same one as in the vanilla JS example above. Pay attention to the syntax `use:clickoutside`: our `clickoutside` function is used as a [Svelte action][svelte.action]. When using this syntax, Svelte will automatically pass the `node` parameter to the action, which is the HTML element the action is placed on. Finally, because `node` is set to emit the `clickoutside` event, we just need to attach the `on:clickoutside` event to the `handleClickOutside` handler.

Neat, huh?

### Comparison to Vue and React

To see the difference, the following block lists actual implementations of `clickoutside` as written in Svelte from the library [@svelte-put/clickoutside](https://svelte-put.vnphanquang.com/docs/clickoutside), React from the library [usehooks-ts](https://usehooks-ts.com/react-hook/use-on-click-outside), and Vue from the library [@vueuse](https://vueuse.org/core/onClickOutside).

<div class="c-callout c-callout--success c-callout--icon-bulb">

[@svelte-put/clickoutside](https://svelte-put.vnphanquang.com/docs/clickoutside) is a library I wrote myself. If you refer to its [documentation page](https://svelte-put.vnphanquang.com/docs/clickoutside), you will see that it provides more features than the other versions do, with about the same number of lines of code.

</div>

<enhanced-code-block group display="tabs">

```javascript title=Svelte src="../examples/clickoutside.svelte.txt"
```

```typescript title=React src="../examples/clickoutside.react.txt"
```

```typescript title=Vue src="../examples/clickoutside.vue.txt"
```

</enhanced-code-block>

Note that the Svelte version is completely isolated, in that it does not depend on any additional imported code as seen in the Vue and React versions. In terms of syntax, I will leave it up to you to decide which one suits your style better. But I hope we can agree on the following observation:

> `clickoutside` written in Svelte is vanilla Javascript, it does not depend on any Svelte-specific API. Instead, React and Vue require an abstraction layer to work in the context of the framework.

Why does this matter? Svelte takes away abstraction and allows us to get closer to vanilla technologies, specifically HTML, CSS, Javascript, and standard web APIs. Any developer having fundamental knowledge of the web can easily pick up Svelte and start making things. And when Svelte inevitably fades away one day as a technology of the past, this knowledge will still be valuable, because it is knowledge about the web, not specific to Svelte.

In other words, in this example, Svelte does not do much, it builds upon the web. The web is the true framework we should care about.

## Compiler is the Framework

The most significant difference of Svelte, at least when it first came out, compared to other frameworks is the fact that it uses a compiler to analyze source code at compile time to minimize code required at runtime. Svelte does not use a virtual DOM like React or Vue does, but brings the reactivity model into its compiler. If what I just said makes little sense to you, think of it as follows:

> Svelte helps us optimize source code before it is even run on end users' machines. The result is often a lighter and faster web page!

However, in this post, we will not talk about this optimization aspect, but rather how Svelte allows us to extend the compiler to create custom features, through an API called [Svelte Preprocessor][svelte.preprocess]. In short, a Svelte preprocessor is a function that takes in Svelte source code and returns new Svelte source code with any changes we want as long as at the end of the compilation process, the source code still follows valid Svelte syntax.

<figure class="shrink-0">
  <img src={sveltePreprocessorImage} class="mx-auto max-w-full rounded" width="800" height="255" alt="illustration: source code on the left with a fire element, a preprocessor in the middle, and source code on the right with a fire emoji" />
  <figcaption>Illustration 2: a Svelte preprocessor that transforms a "fire" element into its emoji representation </figcaption>
</figure>

This time, our task is: implement a static blog using markdown, similar to the *sveltevietnam.dev* page you are reading. Specifically, transform the following markdown code:

```javascript enhanced=false src=../examples/example.md.svelte
```

into this interface:

<Example />

To achieve this, we need to go through quite a few steps

<figure class="shrink-0">
  <img src={preprocessBlogImage} class="mx-auto max-w-full rounded" width="800" height="530" alt="illustration: a compilation process including MDSvex, ShikiJS, enhance-code-block, and vite to transform markdown into the final HTML" />
  <figcaption>Minh họa 3: quá trình biến đổi mã nguồn markdown thành giao diện hoàn chỉnh trên trang blog</figcaption>
</figure>

1. Use the Svelte preprocessor [MDSvex] to transform markdown into corresponding Svelte components.
2. Use [Shiki] to provide [syntax highlighting](https://en.wikipedia.org/wiki/Syntax_highlighting) for code snippets.
3. Use a Svelte preprocessor called `enhanced-code-block` (a custom preprocessor I wrote) to provide additional features such as line numbers, title, copy button, and accordion.
4. Use [Vite] as the build tool to render the final HTML page, similar to the one you are reading.

<div class="c-callout c-callout--success c-callout--icon-bulb">

What you should focus on is: the whole process above is executed at compile time and build time, meaning we do not ship any code from Svelte preprocessor or Shiki to end users. This preprocessing, combined with a few techniques for [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement), allows more than 90% of the content and features on the page to work even without runtime Javascript.

</div>

Let's not get into the implementation details of these Svelte preprocessors. If you are interested, refer to [svelte.config.js](https://github.com/sveltevietnam/sveltevietnam.dev/blob/01ff00046e890f7098f6e8725eba93d88764ce2b/sites/www/svelte.config.js), which sets up all necessary preprocessors to build the Svelte Vietnam Blog.

Thanks to the Svelte preprocessor API, the above task becomes not only feasible but also relatively easy, even for an mediocre developer like me. If the same task were to be done with another framework, I am not sure if I could confidently take on the assignment, or if it would even be possible.

## No one cares

The fact is, nobody really cares about frameworks and their features. What we all ultimately want is to be able to develop efficient and maintainable softwares while creating the best possible experience for users. Fortunately, the creators of Svelte understand this well. In a discussion named "[Tenets](https://github.com/sveltejs/svelte/discussions/10085)", opened by Rich Harris himeself, he explains that Svelte does not aim to be the fastest, lightest, most adopted framework, or to achieve the highest scores in benchmarks or Lighthouse audits. Instead, Svelte aims to be one with "best vibes".

Following the two examples, we see that: if you understand HTML, CSS, and Javascript, you will have a great time with Svelte. Similarly, if you have knowledge about computer science, you can extend Svelte to serve your exact needs, those that even Svelte creators do not even know are needed. Everything comes back to the fundamentals. Svelte is exceptional at staying out of your way, allowing you to focus on building a better web.

So, if this post tingles your curiosity about Svelte, remember this:

<p class="ml-6">
  Don't come for the hype or stay for the drama.<br />
  Instead, come for the ideas, stay for the fundamentals.<br />
  Come for Svelte, and stay for the web.
</p>

[svelte.action]: https://svelte.dev/docs/svelte-action
[svelte.preprocess]: https://svelte.dev/docs/svelte-compiler#preprocess
[mdsvex]: https://github.com/pngwn/MDsveX
[shiki]: https://shiki.style/
[vite]: https://vitejs.dev/
