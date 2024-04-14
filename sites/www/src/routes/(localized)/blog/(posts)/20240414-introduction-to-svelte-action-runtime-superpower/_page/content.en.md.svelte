<script>
	import { textTip } from '$lib/tooltips';
	import { getNotificationContext } from '$lib/notifications';

  const noti = getNotificationContext();
</script>

[Svelte action] (different from [SvelteKit form action](https://kit.svelte.dev/docs/form-actions)) is a technique introduced first-party by Svelte that helps implement and package reusable logic and interaction with the DOM:

```svelte
/// svelte-action
<element use:action></element>
```

Svelte action is highly versatile and is one of the features I often mention when talking about Svelte. If you have used one of the [@svelte-put/*][svelte-put] libraries I wrote, you may have noticed that most of the packages in that collection are built upon Svelte action.

Let's dive deeper into this feature through some concrete examples.

## Examples

No need to go far, this very page you are reading on *sveltevietnam.dev* has quite a few Svelte actions in action (pun intended):

### Example 1: Clickoutside

Perhaps one of the most common applications of Svelte action is handling click event *outside an element*. If you click on the icon <svg inline-src="lucide/settings" class="inline-block" width="16" height="16" stroke-width="2"></svg> at the top right corner of this page, or the icon <svg inline-src="lucide/qr-code" class="inline-block" width="16" height="16" stroke-width="2"></svg> in the "[Share](#share)" section, a corresponding modal window will be activated. When you click on the backdrop of such modal, the window will close. To achieve this, the `clickoutside` action from the [@svelte-put/clickoutside](https://svelte-put.vnphanquang.com/docs/clickoutside) package is utilized:

```svelte
<div use:clickoutside on:clickoutside={close}>...modal...</div>
```

### Example 2: Portal

Sometimes, we need to render some UI at a specific location in the app, detached from the triggering location, such as the modals mentioned in the previous section, or the following push notification system, built on [@svelte-put/noti](https://svelte-put.vnphanquang.com/docs/noti):

<div class="p-4 border">
  <button class="c-btn c-btn--pop" on:click={() => noti.helpers.info('A sample notification, hover to pause, click x to close')}>Push a notification</button>
</div>

Where the modal or notification needs to be displayed, a `portal` action is used:

```svelte
<aside use:portal={notiStore}>...notifications will be rendered here...</aside>
```

### Example 3: Tooltip

At the section below the post title, you will notice a language indicator with a circular "i" icon next to it. Hovering over this icon will trigger a tooltip, providing additional information to the user:

<div class="not-prose p-4 border">
  <p class="c-text-cap1 text-fg-200">
    <span>Manual translation</span>
    <svg
      inline-src="lucide/info"
      class="ml-1 inline-block cursor-help align-text-top"
      stroke-width="1.5"
      height="16"
      width="16"
      use:textTip={{ content: 'You are reading a manual translation of the blog post.' }}
    ></svg>
  </p>
</div>

This tooltip is applied to the icon through the `textTip` Svelte action, built with [@svelte-put/tooltip](https://svelte-put.vnphanquang.com/docs/tooltip):

```svelte
<svg use:textTip={{ content: 'You are reading a manual translation of the blog post.' }}>...icon...</svg>
```

:::div c-callout c-callout--warning
Tooltips should be used sparingly and with caution as they often do not provide a friendly experience, especially for users who rely on assistive technologies. I also discuss about this in the docs page of [@svelte-put/tooltip](https://svelte-put.vnphanquang.com/docs/tooltip#to-tooltip-or-not-to-tooltip).
:::

### Example 4: Inlining SVG

Sometimes, we need to inline an SVG element directly into the app but do not know which SVG it is until the app is running on the browser. A common example for this situation is an SVG icon that we need to change the color based on the theme of the website. To solve this problem, we can use the `inlineSvg` action from [@svelte-put/inline-svg](https://svelte-put.vnphanquang.com/docs/inline-svg):

<div class="flex items-center justify-between gap-10">

```svelte
///class=flex-1
///title=my-page.svelte
<svg
  use:inlineSvg={"https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg"}
  class="special svelte"
></svg>
```

  <svg inline-src="svelte" width="67" height="80" class="svelte shrink-0" />
</div>

:::div c-callout c-callout--info
To ensure [progressive enhancement], *sveltevietnam.dev* does not use `inline-svg` but instead uses the sibling [@svelte-put/preprocess-inline-svg](https://svelte-put.vnphanquang.com/docs/preprocess-inline-svg) library, with the same feature but executed at build time, built on [Svelte preprocessor].
:::

### Example 5: Table of Contents

The [Table of Contents](#toc) of this page also utilizes a `toc` action, built with [@svelte-put/toc](https://svelte-put.vnphanquang.com/docs/toc):

```svelte
///title=Table of Content (truncated)
<main use:toc>
  <section>...Table of content...</section>
  <!-- ... -->
</main>
```

That is probably enough examples to show you how versatile Svelte action can be. But how can action be so flexible?

## Dissecting a Svelte Action

### Input and Initialization

A [Svelte action] is simply a regular Javascript function, with the input being the DOM of the element the action is placed on.

```typescript
///title=my-action.ts
function action(node: HTMLElement) {
  // necessary DOM manipulation
}
```

As you can see, the power of action lies in its simplicity. Action simply opens a window to interact with the DOM, so almost everything you can do with vanilla Javascript, CSS, and HTML is feasible in Svelte action. Because it does not depend on any special Svelte syntax (e.g. `$` syntax), you can easily package action into a file and reuse it where needed.

The function content of `action` will be executed when the component has been mounted into the DOM (hydration has been completed), or at "runtime".

### Runtime vs Progressive Enhancement

As discussed, action is only executed at runtime, meaning that during prerendering or server-side-rendering, any code within action will not take effect. For example, if you add a class to `node.classList` in action, this class will only be added after the webpage has been fully loaded in the browser.

For this reason, to ensure [progressive enhancement], you should only use action when you really need to interact with the DOM - which is often the case when the task involves user interaction. For tasks not related to user interaction, you most likely do not need action or even Javascript at runtime; [Svelte preprocessor] might be a good solution for this case that you should consider. To learn more about Svelte preprocessor, read the article "[Writing a simple Svelte preprocessor](/blog/20231020-writing-a-simple-svelte-preprocessor)".

### Configuration and Update

The second parameter to action is any Javascript primitive or object, which can be used to configure the action as needed:

```typescript
/// title=my-action.ts
// :::diff +
type ActionParameter = {
  enabled?: boolean;
};
// :::
// :::diff -
function action(node: HTMLElement) {
// :::
// :::focus
// :::diff +
function action(node: HTMLElement, param?: ActionParameter) {
//:::
//:::
  if (param?.enabled) { // ... }
}
```

As Svelte variables are "reactive", and in fact `param` can change at any time, action gives us the ability to update its behavior when `param` changes through the `update` method in the output:

```typescript
/// title=my-action.ts
type ActionParameter = {
  enabled?: boolean;
};
function action(node: HTMLElement, param?: ActionParameter) {
  // :::diff +
  return {
    // :::focus
    update: (newParam?: ActionParameter) => {
      if (newParam?.enabled) {
        // turn on
      } else {
        // turn off
      }
    },
    // :::
  };
  // :::
}
```

Finally, we can clean up resources (e.g. `removeEventListener`) in the `destroy` method of the returned output:

```typescript
/// title=my-action.ts
type ActionParameter = {
  enabled?: boolean;
};
function action(node: HTMLElement, param?: ActionParameter) {
  return {
    update: (newParam?: ActionParameter) => {
      if (newParam?.enabled) {
        // turn on
      } else {
        // turn off
      }
    },
    // :::focus
    // :::diff +
    destroy: () => {
      // clean up
    },
    // :::
    // :::
  };
}
```

That is it, Svelte action is that simple! This API should take you only five minutes to get familiar with, and the rest is just standard web APIs that we all (should) know about.

## Dispatching [CustomEvent]

This is not a part of the Svelte action API, but still a common need when writing action. In the following example, through the [CustomEvent] web API, we will dispatch a custom event when the user clicks on the element:

```typescript
/// title=my-action.ts
type ActionParameter = {
  enabled?: boolean;
};
export function action(node: HTMLElement, param?: ActionParameter) {
  function handleClick() {
    // :::focus
    // :::highlight
    const customEvent = new CustomEvent('hello', { detail: 'hello' });
    node.dispatch(customEvent);
    // :::
    // :::
  }
  if (param?.enabled) {
    node.addEventListener('click', handleClick);
  }
  return {
    update: (newParam?: ActionParameter) => {
      // truncated
    },
    destroy: () => {
      node.removeEventListener('click', handleClick);
    },
  };
}
```

With this setup, we can listen to the `hello` event on the element:

```svelte
///title=my-page.svelte
<script>
  import { action } from './my-action';

  function emitHandler(event) {
    console.log(event.detail); // 'hello'
  }
</script>

<!-- :::focus -->
<!-- :::highlight -->
<element use:action on:hello={emitHandler}>...</element>
<!-- ::: -->
<!-- ::: -->
```

## Adding Typescript Support

If possible, use Typescript to set up types for your action to support intellisense during development. Declaring types for action is very easy, you just need to extend the [types exported from `svelte/action`](https://svelte.dev/docs/svelte-action#types):

```typescript
/// title=my-action.ts
// :::diff +
import type { ActionReturn } from 'svelte/action';
// :::

type ActionParameter = {
  enabled?: boolean;
};

//:::diff +
type ActionAttributes = {
  'on:hello': (event: CustomEvent<'hello'>) => void;
};
//:::

// :::diff -
export function action(node: HTMLElement, param?: ActionParameter): {
// :::
// :::diff +
export function action(node: HTMLElement, param?: ActionParameter): ActionReturn<ActionParameter | undefined, ActionAttributes>{
// :::
  // truncated
}
```

:::div c-callout c-callout--info
Notice that in this example, we use a union `ActionParameter | undefined` in `ActionReturn` because `action` allows users to not pass any parameters.
:::

## Action or Component?

If you come from frameworks that heavily use components for everything, you may wonder if the examples in this article can be written with components:

```svelte
///title=component-for-everything.svelte
<Clickoutside>
  <element>...</element>
</Clickoutside>

<Tooltip>...</Tooltip>
```

The answer is most likely yes. However, when using components, you often need to wrap the target `element` in a parent (or use some workaround to limit DOM pollution). Take `clickoutside` as an example, how would you implement this feature with a component?

```svelte
///title=Clickoutside.svelte
<!-- source code from joeattardi/svelte-click-outside: https://github.com/joeattardi/svelte-click-outside/blob/master/src/index.svelte -->
<script>
  // truncated
</script>

<svelte:body on:click={onClickOutside} />
<div bind:this={child}>
  <slot></slot>
</div>
```

Comparing to the [source code of @svelte-put/clickoutside](https://github.com/vnphanquang/svelte-put/blob/9cedde8c33ecce7b1a4058425bf29b6f7a292b91/packages/clickoutside/src/clickoutside.js#L57-L84), you can decide for yourself which method is more readable and suitable for your style. However, we can agree that, in real-world applications, using components will be more verbose and sometimes even clunky since you need to go through a wrapper `div`, and especially because you do not have direct access to the `element` you want to manipulate.

```svelte
///title=my-page.svelte
<element use:clickoutside class="absolute ...">...</element>
<!-- vs -->
<Clickoutside class="absolute ...">
  <element>...</element>
</Clickoutside>
```

For me personally, using component for such tasks do not follow the "[single responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle)" principle. Component is a good solution for encapsulating UI. However, in the case of `clickoutside`, we only want to encapsulate the event handling logic, while decisions about markup or style are irrelevant and should be kept separate.

:::div c-callout c-callout--success c-callout--icon-bulb
In short, when using Svelte, I often avoid using components as much as possible, and instead utilize features like action, context, or store to handle tasks that are not related to UI.
:::

## Change in Svelte 5

Svelte 5 should be announced any moment now, with many significant changes in its syntax. Fortunately, the way we write and use action in this article will still work. There is only one change that you may need to pay attention to in the future: the `on...` syntax to listen to events will no longer have the colon:

```svelte
/// title=my-page.svelte
<!-- :::diff - -->
<element use:action on:hello={...}>
<!-- ::: -->
<!-- :::focus -->
<!-- :::diff - -->
<element use:action onhello={...}>
<!-- ::: -->
<!-- ::: -->
```

Remember to update your `ActionAttributes` interface:

```typescript
/// title=my-action.ts
type ActionAttributes = {
  // :::diff -
  'on:hello': (event: CustomEvent<'hello'>) => void;
  // :::
  // :::focus
  // :::diff +
  'onhello': (event: CustomEvent<'hello'>) => void;
  // :::
  // :::
};
```

:::div c-callout c-callout--info
Again, it is worth acknowledging that action is just a regular Javascript function that does not depend too much on Svelte syntax. Therefore, action tends to stay stable even if Svelte changes in the future. Improvements in Svelte 5, especially runes, which now can also run in `js` or `ts` files), will even open more doors for action to better interact with other parts of the application.

Svelte action is really one of the best API design I have seen.
:::

## Closing

Thank you for reading. You can see more examples of Svelte action in packages from the [svelte-put] collection. What about you? How have or will you use action in your project? Share your thoughts in our [Svelte Vietnam Discord](https://discord.sveltevietnam.dev)!

<style>
  svg.svelte {
    filter: drop-shadow(0 0 0.5rem theme('colors.svelte'));
  }
</style>

[Svelte action]: https://svelte.dev/docs/svelte-action
[Svelte preprocessor]: https://svelte.dev/docs/svelte-compiler#preprocess
[CustomEvent]: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
[svelte-put]: https://svelte-put.vnphanquang.com/
[Progressive Enhancement]: https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement
