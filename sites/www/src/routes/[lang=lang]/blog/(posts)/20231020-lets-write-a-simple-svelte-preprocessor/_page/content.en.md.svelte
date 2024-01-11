In this post, we will be using [Svelte preprocessor](https://svelte.dev/docs/svelte-compiler#preprocess)
to solve a simple problem (although we will overcomplicate it a tiny bit for learning purposes). If you have not written one before, hopefully this post provides example and reference for you to get started and have an introductory overview of how Svelte preprocessor works.

## Presenting the Problem

A website may have a lot of external links (those that links to pages outside of the current domain). For these links, we usually add attributes like `target=_blank` and `rel=…` (with values like `noreferrer noopener`) to ensure security and good user experience. A question follows: is there a way to automate this? In other words, how can we detect external links and set up those attributes automatically instead of manually adding them for each `a` tag? Svelte preprocessor is one of the solutions.

## Other Solutions

Before diving deeper, let's take a look at other solutions besides Svelte preprocessor. There are usually multiple ways to solve a problem, and it is always good to know the alternatives to have a better overview.

### Svelte Component

Perhaps this is the most predictable solution: we create a [component](https://svelte.dev/docs/svelte-components) inside which the necessary attributes are declared and set up accordingly. However, this is quite wasteful, as it only wraps the `a` tag. Instead of:

```svelte
<a href="..." target="_blank" rel="noreferrer noopener">...</a>
```

we would write:

```svelte
<ExternalLink href="...">...</ExternalLink>
```

With this approach, we would have to set up [prop](https://svelte.dev/docs/svelte-components#script-1-export-creates-a-component-prop) as a middleman to pass other attributes like `class`, `aria-`, `data-`, … Also, when using component, we lose direct access to the `a` element (`HTMLAnchorElement`), which makes it harder to modify style, manage event handling, or use Svelte animation and transition.

```svelte
<a animate:flip transition:fly /> <!-- ✅ -->
<!--
  the code below will throw error because `animate` and `transition` directives
  are only applicable for element and not component
-->
<ExternalLink animate:flip transition:fly /> <!-- ❌ -->
```

In Svelte, I usually avoid writing component if it is not really necessary. One thing I like about Svelte is that it provides convenient directives for HTML elements, such as `animate`, `transition`, `use`, `on`; through these features, Svelte indirectly encourages me to use more of vanilla technologies. Previously when I was too familiar with React, writing plain HTML felt strange, especially when applying complex (and arguably unnecessary) design patterns like [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/). Not to say that it is right or wrong, but going back to HTML makes me feel much more at home.

### Svelte Action

Svelte also provides a solution to interact with `Element` called [action](https://svelte.dev/docs/svelte-action), often seen as `use:action`. This is my favorite feature of Svelte; the majority of packages from my project [svelte-put](https://github.com/vnphanquang/svelte-put) is based on this strategy. In short, action helps us access `HTMLElement` after it has been created on the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction). In our particular example, we would interact with `HTMLAnchorElement` and add the necessary attributes:

```svelte
<script>
  function externalLink(node) {
    node.target = '_blank';
    node.rel = 'noreferrer noopener';
  }
</script>

<a href="..." use:externalLink></a>
```

All done, simple enough? However, this approach requires Javascript (JS), and only works on the browser after the page has been rendered, meaning that the initial HTML returned from the response does not have those attributes. But if you do not care about server-side-rendering (e.g. for a SPA), this solution is enough.

### Vite Plugin

In Vite's [plugin API](https://vitejs.dev/guide/api-plugin.html), we can use the `transform` hook to change source code as we wish. The idea is as follows:

1. check if the file is HTML, if so, continue to the next step,
2. use [regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions) or [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) to find `a` tags, and transform the code to add the necessary attributes,
3. return the transformed code, and the updated source map.

This approach is more advanced and requires experience working with low-level tooling. The solution is enough if you are writing plain HTML without any framework, or if you have set up Svelte to generate static pages without JS ([csr](https://kit.svelte.dev/docs/page-options#csr) is turned off).

However, SvelteKit will use a technique called [hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)) to turn a static page into a dynamic one in the appropriate environment for Svelte to perform necessary JS tasks. Imagine that SvelteKit has two versions of your website: one is the prerendered or server-rendered HTML, and two is a similar version in JS. When hydration happens, the JS version will replace the HTML one. Our Vite plugin above only changes the HTML version, the JS version is not updated, so when hydration happens, the added attributes will disappear.

We can see that this approach is the opposite of action. Action only works after hydration, but not in the initial HTML; while Vite plugin works in the initial HTML but not after hydration.

## What about Svelte Preprocessor?

Svelte preprocessor will help us do the following:

- detect links that are external and static (we will discuss this later), then add the necessary attributes. This task is fully automated, we will not need to add anything on matching `a` tags,
- attribute are added in the initial HTML and stay after hydration.

Sounds magical? If you notice, the reason you can use Typescript, SASS, or PostCSS in Svelte is thanks to preprocessors.

## Write the Preprocessor

We have taken quite a detour so far. Let's come back and do what we are here for. Below is a simplified version of the Svelte preprocessor we have been discussing:

```javascript
import MagicString from 'magic-string';
import { walk } from 'svelte/compiler';
import { parse } from 'svelte-parse-markup';

/** @type {import('svelte/compiler').PreprocessorGroup} */
export const preprocessExternalLink = {
  markup(o) {
    const { content, filename } = o;
    // (1)
    const s = new MagicString(content);
    const ast = parse(content, { filename });

    // (2)
    walk(ast.html, {
      enter(node) {
        if (node.type === 'Element' && node.name === 'a') {
          let external = false;

          // (3)
          const hrefAttr = node.attributes.find((attr) => attr.name === 'href');
          if (hrefAttr && hrefAttr.value?.[0]?.type === 'Text') {
            const href = /** @type {string} */(hrefAttr.value[0]?.raw);
            if (href.startsWith('http')) {
              const url = new URL(href);
              external = !['localhost', 'yourhostname'].includes(url.hostname);
            }
          }

          // (4)
          const firstChild = node.children[0];
          if (external && firstChild) {
            s.appendLeft(firstChild.start - 1, ' target="_blank" rel="noreferrer noopener"');
          }
        }
      },
    });

    return {
      code: s.toString(),
      map: s.generateMap(),
    };
  },
};
```

The idea of the above code is quite simple as follows:

1. For each `.svelte` file, we parse the source code into an `AST` structure.
2. Walk through each `node` of the `AST`, check if it is an `a` tag, if so, continue.
3. Find the `href` attribute, check if it points to an external domain, if so, the `a` tag is an external link and we continue to the next step.
4. Add attributes, return new code and new source map.

Thanks to existing libraries, the most difficult tasks have already become much easier:

- [magic-string](https://github.com/Rich-Harris/magic-string): written by [Rich Harris](https://github.com/Rich-Harris) (the author of Svelte), helps with source code string manipulation.
- [svelte-parse-markup](https://github.com/bluwy/svelte-parse-markup): written by [Bjorn Lu](https://github.com/bluwy) (active contributor of Svelte and Vite team), helps parse source code as `AST`.
- To know how an `AST` looks like, you can use [Svelte REPL](https://svelte.dev/repl/hello-world?version=4) and change the output window to “AST output”.

So, we can see that preprocessor has a lot in common with the Vite plugin approach. The difference is that we are transforming Svelte source code (transforming a piece of Svelte code into another piece of Svelte code) instead of operating on the HTML from the build output.

## Extension

Previously, I said that this preprocessor only works for links that are "external and static". Static means that the `href` attribute value is a hard-coded string, and is not a variable.

```svelte
<!-- static -->
<a href="https://www.sveltevietnam.dev">...</a>

<!-- not static -->
<a href={SOME_VARIABLE}>...</a>
```

In this case, our preprocessor cannot detect the link as external. To overcome this, we can assign an arbitrary attribute as a marker for the preprocessor: if the `a` tag has this attribute, it is an external link. For example:

```svelte
<!-- :::diff - -->
<a href={SOME_VARIABLE}>...</a>
<!-- ::: -->
<!-- :::diff + -->
<a href={SOME_VARIABLE} data-external>...</a>
<!-- ::: -->
```

Then, we need to change a bit of our preprocessor code to check if this attribute exists, and if so, perform the same operations as already discussed.

```javascript
// :::diff -
- let external = false;
// :::
// :::diff +
+ let external = node.attributes.some((attr) => attr.name === 'data-external');
// :::

// ... some other code update
```

Errors will also be thrown if an `a` tag already has the `rel` or `target` attribute. We can extend the above code to handle these scenarios. To avoid being too verbose, you can read [the full code here](https://github.com/sveltevietnam/sveltevietnam.dev/blob/a8a2ff08e9b715e34f4c677bd620b8c929f4aae9/sites/www/svelte.config.js#L25-L80), which is used by `sveltevietnam.dev` itself for the same purpose on this page that you are reading.

## Questions

You might wonder how one could know all these API. The answer is we have to write it ourselves: the more we code, the more we understand. Low-level stuff like this is usually not mentioned in articles or videos on Youtube, so you will have to learn from reading the source code of existing preprocessors.

You might also say that we obviously have to write more code with this approach compared to the other two first ones (component and action), is it worth it? The preprocessor strategy requires more code, yes, but we write it once and in one place. It also conveniently resolves all issues we have encountered with other solutions. Nevertheless, you can think of it as an exercise to gain better understanding of preprocessor. Regarding the practicality of our particular preprocessor here, it really depends on the context.

There is one small other detail you might have noticed: the above code is written in vanilla JS with [JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html). Let's save the discussion for another post, but, in a few words, this helps keep a minimal implementation. The API and libraries we used here are written in JS and intended to focus on functionalities rather than satisfying the Typescript (TS) type checker. It will otherwise take substantially more time if we write it in TS.

## Summary

In short, Svelte preprocessor is a piece of code run by the Svelte compiler and used to transform Svelte source code. Specifically, We have written a preprocessor to detect external `a` links and add `rel` and `target` attributes accordingly. By going through this example, we have gain an overview of how a typical preprocessor works and is implemented, as well as the flexibility it brings to the table. Svelte preprocessor can do much more. In fact, most of us have probably already used preprocessor, even without knowing so. Hopefully this post provides a good starting point for you to write your own preprocessor.

Happy coding!
