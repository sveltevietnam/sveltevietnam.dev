<script>
  import devtoolsSSRImage from '../images/devtools-ssr-html.webp';
</script>

<div class="c-callout c-callout--info">

This is the second part of the "Behind the Screen" blog series, where I share my experience and lessons learned while building *sveltevietnam.dev*. You can read the [first part here](/en/blog/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam) (not a prerequisite for this post).

</div>

Today, dark mode is becoming a common and even necessary feature to provide a complete user experience. Although the problem seems simple on the surface, it does require meticulous work and a combination of many small details from many different technologies. This blog post discusses one of many possible implementations of dark mode with Svelte and SvelteKit. Most of the details, however, are framework-agnostic, you can apply them to any framework and front-end project.

## Dark Mode with CSS

First, we look at the simplest strategy to implement a dark mode with [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). Let's take an example where we have set up a system like this:

```css title="app.css"
:root {
  --color-bg: white;
  --color-fg: black;
}

html {
  background-color: var(--color-bg);
  color: var(--color-fg);
}
```

Notice that [:root](https://developer.mozilla.org/en-US/docs/Web/CSS/:root) is actually just `html`, we use it here as a general convention for a place to declare global CSS variables. When changing the value of the `--color-*` variables, the interface will automatically update accordingly.

Imagine now we have a magical [At-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule) called `@dark` that can activate the declarations inside when dark mode is turned on:

```css title="Hypothetical @dark at-rule"
:root {
  --color-bg: white;
  --color-fg: black;

  /* :::diff + */
  @dark {
    --color-fg: black;
    --color-bg: white;
  }
  /* ::: */
}
```

In the above CSS, the default mode is light. When `@dark` is active, we change the value of the corresponding CSS variables to express dark mode. If we could do this, we would have completed more than half of the work. Unfortunately, CSS does not support this magical syntax. But don't worry: in the following sections, we will try to simulate the `@dark` feature.

## When Is It Dark?

When does dark mode take effect? Many applications will allow users to choose between `light` and `dark` modes in some settings. However, if the user has just visited the application for the first time, is it `light` or `dark`?

The answer is that we need to look into the operating system (OS) settings with the help of the CSS media query [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme):

```css title="prefers-color-scheme"
@media (prefers-color-scheme: dark) {
  /* CSS setup for dark mode */
}

@media (prefers-color-scheme: light) {
  /* CSS setup for light mode */
}
```

So, there are four possible situations:

1. User has not selected any mode and the default mode of the operating system is `light`
2. User has not selected any mode and the default mode of the operating system is `dark`
3. User has explicitly selected `light` mode
4. User has explicitly selected `dark` mode

As a result, our magical `@dark` needs to handle (2) and (4); (2) is OS settings, and (4) is user preference.

### User Preference

For (4), we need to setup additional HTML that can express user experience and is selectable via CSS selectors. There are a couple of ways to do this, most commonly with class name or attribute. Here is what we will do in this blog post:

```svelte title="app.html"
<html data-color-scheme="dark">
  <!-- application content -->
</html>
```

The value of `data-color-scheme` is `dark`, `light`, or `system`. `system` means that situation (2) will take effect. We will discuss how to use JS for event handling and mode switching later. With this setup, we can adjust the CSS as follows:

```css title="app.css"
:root[data-color-scheme="dark"] {
  /* corresponding setup */
}
```

### OS Settings

For (2), we almost took care of it with `prefers-color-scheme` as seen above. However, if we stop at that, the user may be locked in one mode unless they manually change the OS settings.

```css title="app.css"
@media (prefers-color-scheme: dark) {
  :root {
    /* ... */
  }
}
```

For example, a user has selected `light` in the application settings but the OS is `dark`, the above CSS will still take effect, because `prefers-color-scheme` is still `dark`. To be more precise, we need to negate such case:

```css title="app.css"
@media (prefers-color-scheme: dark) {
  /* :::diff + */
  :root:not([data-color-scheme="light"]) {
  /* ::: */
    /* ... */
  }
}
```

This means: if the default mode of the OS is `dark` and the user has not explicitly chosen `light`, then apply this CSS.

<div class="c-callout c-callout--info c-callout--icon-bulb">

**CSS Cascading Order**

Can we play around with [cascading order](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#cascading_order), in this case *specificity* and *order of appearance*, to achieve the same effect? Yes, but personally I find relying on those not necessarily easier to understand. Nor is it more concise. If you figure out a more minimal setup, I would love to hear about it in our [Discord](https://discord.sveltevietnam.dev)!

</div>

---

Finally, we are ready to rewrite the CSS in the previous section and replace `@dark`:

```css title="app.css"
/* light */
:root {
  --color-bg: white;
  --color-fg: black;
}

/* dark, as in (2) */
/* :::highlight */
@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) {
/* ::: */
    --color-bg: black;
    --color-fg: white;
  }
}

/* dark, as in (4) */
/* :::highlight */
:root[data-color-scheme="dark"] {
/* ::: */
  --color-bg: black;
  --color-fg: white;
}

html {
  background-color: var(--color-bg);
  color: var(--color-fg);
}
```

## A Magical PostCSS Plugin

I can hear you say "That is very complicated!". Yes, it will be super inconvenient if we need to memorize and be this verbose each time we apply some CSS rules for dark mode. For example, imagine we want to change the style of an element with class `.box`:

```css title="app.css"
.box {
  background-color: blue;
}

/* dark, as in (2) */
/* :::highlight */
@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) .box {
/* ::: */
    background-color: red;
  }
}

/* dark, as in (4) */
/* :::highlight */
:root[data-color-scheme="dark"] .box {
/* ::: */
  background-color: red;
}
```

That is such a headache. Fortunately, I have abstracted this into a [PostCSS](https://postcss.org/) plugin called [postcss-color-scheme](https://github.com/vnphanquang/postcss-color-scheme), providing the `@dark` syntax itself:

```css title="app.css"
.box {
  background-color: blue;

/* :::highlight */
  @dark {
/* ::: */
    background-color: red;
  }
}
```

Much more concise yeah? I will not discuss this plugin in details here, you can read more at the [project's github](https://github.com/vnphanquang/postcss-color-scheme). In short it will convert `@dark` into the verbose version we have already seen. This plugin also provides the `@light` syntax if you need that.

<div class="c-callout c-callout--info">

**Update - January 2025**

The syntax for `@dark` and `@light` has been changed to `@media dark` and `@media light` in V2 of `postcss-color-scheme` to be more compatible with modern tooling.

</div>

## CSS for Dark Mode in Svelte Component

After using Svelte for a while, you will know that CSS in Svelte is "component-scoped" and the Svelte compiler will automatically purge CSS code that does not match any HTML in the current component. Say, for example, we have the following Svelte component:

```svelte title="Box.svelte"
<div class="box" />

<style>
  .box {
    background-color: blue;
  }

  .something-else {
    color: blue;
  }
</style>
```

Svelte will add a hash to the class `.box`, making it into something like `.box.s-SeNnWx1nPv6T`. Additionally, `.something-else` will be removed because there is no element with the class `.something-else` in this component. If we want to keep `.something-else`, the `:global` syntax is necessary.

```svelte title="Box.svelte"
<style>
  :global(.something-else) {
    color: blue;
  }
</style>
```

When we setup dark mode (regardless of using `@dark` or not), we will encounter this situation, because `html` or `:root` does not exist locally in the component. In that case, remember to add `:global`. Or if using `postcss-color-scheme`, just add the `global` modifier like this:

```svelte title="Box.svelte"
<style>
  /* :::diff + */
  :global {
  /* ::: */
    .box {
      background-color: blue;

      @dark {
        background-color: red;
      }
    }
  /* :::diff + */
  }
  /* ::: */
</style>
```

## Extra Credit: Dark Mode with TailwindCSS

<div class="c-callout c-callout--info">

This section is not essential; it discusses setup with [TailwindCSS](https://tailwindcss.com/) to improve developer productivity. If you do not use TailwindCSS or are not interested, feel free to skip to [the next section](#mode-switching-with-js).

</div>

It would be convenient if we can could the following syntax:

```svelte
<div class="bg-blue-500 dark:bg-red-500 light:text-gray-500" />
```

`dark:` and `light:` are called [variant](https://tailwindcss.com/docs/adding-custom-styles#arbitrary-variants) in Tailwind. The `postcss-color-scheme` plugin adds to your Tailwind config and make these two variants available. The specific setup depends on the Tailwind version you are using

<enhanced-code-block display="tabs" group>

```javascript title="Tailwind V3"
/// @file: tailwind.config.*

/** @type {import("tailwindcss").Config } */
module.exports = {
  // your config ...
  // :::diff +
  darkMode: '',
  plugins: [require('postcss-color-scheme/tailwind')],
  // :::
};
```

```javascript title="Tailwind V4"
/// @file: app.css

/* :::diff + */
@import 'tailwindcss';
@import 'postcss-color-scheme/tailwind.css';
/* ::: */
```

</enhanced-code-block>

See the [Tailwind Support](https://github.com/vnphanquang/postcss-color-scheme#tailwind-support) section in the documentation for more details.

<h2 id="mode-switching-with-js">Mode switching with JS</h2>

To let user switch between the two display modes, we can capture an event from some button or input and use the following JS snippet:

```javascript title="changeColorScheme"
/**
 * @param {'dark' | 'light' | 'system'} scheme
 */
function changeColorScheme(scheme) {
  document.documentElement.dataset.colorScheme = scheme;
}
```

Note that if you are using [SvelteKit SSR feature](https://kit.svelte.dev/docs/page-options#ssr), the code above can only be run on the client because it references `document`.

<div class="c-callout c-callout--info">

Nowadays, with the CSS [:has](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) feature, we can simplify the solution above and do not even have to use JS:

```svelte
<input id="is-dark" />

<style>
  :root:has(#is-dark:checked) {
    /* corresponding setup */
  }
</style>
```

Not relying on Javascript means our application is more accessible. Of course, be aware of the
complexity this may add to your codebase.

</div>

## Caching User Preference with Cookie and SvelteKit

The most common method to store the current display mode is to use web storage such as [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). However, JS needs to be loaded before we can access web storage, which results in the common FOUC (flash of unstyled content) issue because the UI first renders in its default mode then updated to the correct settings only after they are read by JS. We can work around this by blocking the application from rendering until JS is loaded, but this also degrades user experience, and worse, the application will not work if a user cannot access JS (which happens more often than we think, [read more here](https://kryogenix.org/code/browser/everyonehasjs.html)).

<div class="c-callout c-callout--info">

A workaround for this workaround is to work around once more: you can technically have a blocking script tag (vanilla JS) that does the necessary logics to initiate the correct display mode. In SvelteKit this script tag would typically be placed in `app.html` before any app markup. I will let you be the judge of whether this is a good idea or not.

</div>

If our application is static or an SPA, there is no other choice (as far as I know). But if we have a server, we can do much better with cookie. Cookie can be read by both client and server, which helps us set the correct value for `data-color-scheme` in the initial HTML response. Let's go through each step.

### Setup on the Client

Firstly, we add `PUBLIC_COOKIE_COLOR_SCHEME` to `.env` to set a public environment variable that can be accessed from both client and server (read more about environment variables [here](https://kit.svelte.dev/docs/modules#$env-static-public)):

```bash title=".env"
# :::diff +
PUBLIC_COOKIE_COLOR_SCHEME=color-scheme
# :::
```

<div class="c-callout c-callout--info">

We use this variable to store the name of the cookie. We can alternatively use the hard-coded string `color-scheme` but it is a convention to store the cookie name in an environment variable, which allows us to be flexible depending on the environment without having to change the source code.

</div>

Next, we use the [document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) API to set the cookie from the client. Add this to the `changeColorScheme` function:

```javascript title="changeColorScheme"
// :::diff +
import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';
// :::

/**
 * @param {'dark' | 'light' | 'system'} scheme
 */
function changeColorScheme(scheme) {
  document.documentElement.dataset.colorScheme = scheme;
  // :::diff +
  document.cookie = `${PUBLIC_COOKIE_COLOR_SCHEME}=${scheme}; path=/; SameSite=Lax; Secure`;
  // :::
}
```

Cookies are often set on the server side. However, in this particular case, we have full control over the usage of this cookie; plus it does not contain any sensitive information such as identity or API key. Using `document.cookie` is much more convenient because we do not have to set up a [form action](https://kit.svelte.dev/docs/form-actions) or [API endpoint](https://kit.svelte.dev/docs/routing#server).

<h3 id="set-up-on-the-server">Setup on the Server</h3>

We use SvelteKit [hooks.server](https://kit.svelte.dev/docs/hooks) to read the cookie and set the correct value for `data-color-scheme` in the HTML response.

```javascript title=src/hooks.server.js
import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';

/** @type {import('@sveltejs/kit).Handle} */
export const handle = async ({ event, resolve }) => {
  const { locals, cookies } = event;

  locals.colorScheme = (cookies.get(PUBLIC_COOKIE_COLOR_SCHEME)) || 'system';

  const response = await resolve(event, {
    // :::highlight
    transformPageChunk: ({ html }) => html.replace('%cookie-color-scheme%', event.locals.colorScheme)
    // :::
  });

  return response;
}
```

Note *line 10*, we use `transformPageChunk`, a callback to SvelteKit `resolve`'s options, to replace the string `cookie-color-scheme` with the value of the cookie. To complete the setup, we need to modify `src/app.html` a bit:

```html title=src/app.html
<!-- :::diff - -->
<html>
<!-- :::diff -->
<!-- :::diff + -->
<html data-color-scheme="%cookie-color-scheme%">
<!-- :::diff -->
```

---

So, we can imagine a user journey as follows:

- User accesses the application for the first time, SvelteKit server hook is triggered, because the cookie `PUBLIC_COOKIE_COLOR_SCHEME` is not set, `cookie-color-scheme` is replaced with the default value `system` in the HTML response.
- Browser receives the HTML and automatically selects the display mode based on the `prefers-color-scheme` value from the OS.
- User explicitly changes the display mode, the cookie is set, the `data-color-scheme` attribute on `html` is updated, the corresponding CSS is activated and the interface changes accordingly.
- If JS is enabled on the browser and the user does not manually reload the page, SvelteKit client-side router will handle following navigation until the user journey ends. During this process, SvelteKit server hook is not triggered again.
- When user reloads or opens the application in a new tab, SvelteKit server hook is triggered, the cookie is read and the `data-color-scheme` value is updated accordingly. If the value is `light` or `dark`, the CSS for light/dark mode will take effect, instead of using the OS default. The cycle above is repeated afterwards.

We can verify that the HTML returned from server has the correct `data-color-scheme` value by looking at the Network tab in Chrome Devtools right on the page you are reading:

<img
  src={devtoolsSSRImage}
  alt="Screenshot of Chrome Devtools Network tab, showing the correct data-color-scheme attribute"
  loading="lazy"
  decoding="async"
  class="rounded"
/>

### Typescript Support

If you are using Typescript, add the following to `src/app.d.ts` to satisfy the type checker:

```typescript title="src/app.d.ts"
declare global {
  namespace App {
    type ColorScheme = 'light' | 'dark' | 'system';

    interface Locals {
      colorScheme: ColorScheme;
    }
  }
}
```

## Extra Credit: Accessing Color Scheme with Svelte Context

<div class="c-callout c-callout--info">

**Update - January 2025**

This section was originally written with Svelte 4 and some introduced techniques have
become redundant with the introduction of Svelte 5. To avoid being lengthy, I have decided to remove
the text. Please have a look at [sveltevietnam.dev source code](https://github.com/sveltevietnam/sveltevietnam.dev/blob/5f15e0189ba24b617b76832f3294d315678be09b/sites/sveltevietnam.dev/src/lib/settings/context.svelte.ts#L22-L27) for details on how to better integrate with Svelte Context.

</div>

## Effective Collaboration with Designers

The truth is, the above details are **not** the most complicated parts; once we understand and implement them for the first time, the next will be similar and easier. The harder part of making a dark mode, or any color system in general, is communication between designers and developers.

Each project and design team have their own conventions and standards, but the most important thing, from the perspective of a developer, is the presence of a technical voice in the design process, especially from the beginning. With my limited experience in the industry, what seems obvious to a developer is not always easy to understand for a designer, and vice versa. Collaboration between the two sides will simply help developers be able to use what designers make and avoid changes to the source code or design later down the road.

Pay special attention to your color palette. Each color should be a design token that is communicated clearly to both designers and developers. Color palette is probably the first and most important element in any design system. Organizing a color palette to be compatible with applications with dark mode is a bit more complicated than usual because each color can exist in two versions for two display modes.

At *sveltevietnam.dev*, we distinguish between primitive colors and semantic/contextual colors. Primitive colors are the basic colors we already know: blue, red, yellow, ... Other colors will be built upon the these primitives, depending on different contexts within the application, i.e. colors for foreground or background, primary or secondary, status colors such as success, warning, error, ... To learn more about our implementation with this system, visit the dedicated [Design](/en/design) page.

The *sveltevietnam.dev* project also uses Figma as the design tool and takes advantage of the [Variable](https://help.figma.com/hc/en-us/sections/14506605769879-Variables) feature to represent the color palettes, which helps designers be aware of the corresponding design tokens that translate to CSS variables during the development process.

## Closing

We have discussed a lot of different details and aspects of implementing dark mode in a SvelteKit application in particular, and a front-end project in general. If you are still reading, that is amazing - thank you for enduring my lengthy writing! If you have any question or comment, be sure to drop by our [Discord](https://discord.sveltevietnam.dev) for further discussion!

<div class="c-callout c-callout--info">

You can find the next post in the "Behind the Screen" series at "[A few secrets of sveltevietnam](/en/blog/20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev)".

</div>
