<script>
	import { LoadingContext } from '@sveltevietnam/kit/contexts';
  import Example1 from './examples/1-sveltekit-navgiating-state.md.svelte';
  import Example2 from './examples/2-context-abstraction.md.svelte';
  import Example3 from './examples/3-using-context.md.svelte';
  import Example4 from './examples/4-manual-trigger.md.svelte';
  import Example5 from './examples/5-manual-load.md.svelte';
  import Example6 from './examples/6-pattern-global-context.md.svelte';
  import Example7 from './examples/7-pattern-passing-state.md.svelte';

	const globalLoading = LoadingContext.getGlobal();

  let unload = null;
  function toggleLoadingBar() {
    if (unload) {
      unload();
      unload = null;
    } else {
      unload = globalLoading.load();
    }
  }
</script>

[Progress indicators](https://www.nngroup.com/articles/progress-indicators/), sometimes called
spinners or loaders, can be overused and tend to lead to poor UX with an impression of sluggishness.
When used with clear intention, however, they can help ensure [visibility of system status](https://www.nngroup.com/articles/visibility-system-status/) and make slow processes a bit more tolerable for user.

In my opinion, one perfect use case for progress indicator is for page navigation, which has a
high probability and frequency of slowdowns, arguably more than other forms of user actions, because:

1. Navigation demands to fetch a huge amount of data, some of which relies on third-party services.
2. Navigation depends on network stability. How often do we click on some link on our mobile device,
   see nothing happening, only to have the new page loaded a few seconds later just before we're about to click again?

Github has a subtle yet effective way of addressing this issue by showing a thin progress
bar at the top during navigation. This post essentially tries to replicate that effect in SvelteKit
and expands on this idea to introduce (or revisit, if you are already familiar with) some useful patterns
for using Svelte context and packaging reactivity via class.

## SvelteKit `navigating` state

In typical fashion, SvelteKit already has our back with the built-in [navigating](https://svelte.dev/docs/kit/$app-state#navigating) state from `$app/state`:

<Example1 />

<div class="c-callout c-callout--info">

I've found that this is also a nice use case for the [`{#await}` syntax](https://svelte.dev/docs/svelte/await),
which has been somewhat eclipsed by the recent [experimental Async Svelte feature](https://svelte.dev/docs/svelte/await-expressions).

</div>

## Loading Bar UI

Detecting actual progress in percentage is likely impossible. So here I'm using some hard-coded
easing function for a dynamic pseudo-progress effect:

<div class="c-callout c-callout--info c-callout--icon-bulb">

Below code is taken from the
[actual implementation](https://github.com/sveltevietnam/sveltevietnam.dev/blob/c28f7fcda148a61e14f71662ece74aa817683716/packages/kit/src/components/loading-bar/LoadingBar.svelte)
of loading bar on the very page you are reading. Try switching pages, or click button below,
to see it in action!

<button class="c-btn c-btn--pop mt-6" onclick={toggleLoadingBar}>
  {#if unload}
    Turn off loading bar
  {:else}
    Turn on loading bar
  {/if}
</button>

</div>

```svelte src="../../../../../../../../../packages/kit/src/components/loading-bar/LoadingBar.svelte" title="LoadingBar.svelte"
```

[Son and done](https://lostinlocalization.com/totk-construction-motto/)? Yes, but let's take this a
bit further...

## Triggering on Demand

I'm rather lazy, so it'd be great to reuse this loading bar when I don't feel like implementing a
dedicated one in some cases (knowing that I probably should). Let's entertain this idea by
implementing a context that allows triggering the loading state anywhere in our app.

### Context Abstraction via Class

<Example2 />

The reason for the `auto` naming here will be clear in a moment. For now, let's apply this in the
layout from earlier:

<Example3 />

### Manual trigger

It's good and all that we have a context now, but functionality-wise nothing has changed.
Let's add some logics to `LoadingContext` to allow triggering the loading state programmatically.

<Example4 />

Now, we can simply get the context and call `load()`. For example:

<Example5 />

Feel free to adjust this implementation to your taste. For example, one may prefer to have an explicit
`.unload` method instead of the returned callback.

## Emergent Patterns

Looking back, this post introduced two important patterns I often reach for when building Svelte apps:

### 1. Context via Class & Global Context Instance

[Svelte context](https://svelte.dev/docs/svelte/context) is a great tactic to share logics in a way
that can help ensure encapsulation and testability. For global contexts, I often use static methods:

```ts title="some-context.svelte.ts"
import { getContext, setContext } from 'svelte';

class MyContext {
  static GLOBAL_KEY = Symbol('my-context');

  constructor(init) { /* ... */ }

  static setGlobal(init) {
    return setContext(MyContext.GLOBAL_KEY, new LoadingContext(init));
  }

  static getGlobal() {
    return getContext(MyContext.GLOBAL_KEY);
  }
}
```

This also allows me to reuse the same class to spawn ad-hoc context, one that override or co-exist
with the global one. You may also adjust to leverage the new
[createContext API](https://svelte.dev/docs/svelte/context#Type-safe-context).

### 2. Passing Reactive State into Functions

It wasn't obvious to me at first, when Svelte 5 came out, how reactivity can be preserved when
`$state` is passed into functions, methods, constructors, etc. Simply passing as arguments
won't work:

<Example6 />

Instead, I need to create a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
that references the reactive state:

<Example7 />

In hindsight, this makes perfect sense; see [Svelte docs > $state > Passing state into functions](https://svelte.dev/docs/svelte/$state#Passing-state-into-functions)
for a more detailed explanation. Fortunately, the Svelte compiler today does a great job of catching
such mistakes. Expect the [state_referenced_locally](https://svelte.dev/docs/svelte/compiler-warnings#state_referenced_locally)
warning if you forget to use closure.

## Closing

I hope this has been helpful. If you have any feedback, please feel free to leave a comment where
you see this post. I am also available at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com)
or at the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

Thank you for reading and happy loading!
