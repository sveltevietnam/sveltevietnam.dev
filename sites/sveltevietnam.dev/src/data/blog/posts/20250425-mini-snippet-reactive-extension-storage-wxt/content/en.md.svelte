Recently I joined a project that needed to build some web extensions. My mind immediately went: "time to finally try [wxt.dev](https://wxt.dev/) for real!". After a long time admiring from afar, I now can officially say I have tried WXT and I'm enjoying it so far. Disclaimer, however, I am by no stretch an expert in either WXT or web extensions. I may very well make some terrible mistake in this post. Please call me out if you see something wrong!

This post essentially shows my attempt to wrap around `@wxt-dev/storage` with [createSubscriber](https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber) to make it reactive in Svelte land. Pre-exposure to `createSubscriber` is helpful to understand the code here (if not yet, now may be the time?). And it'll also be helpful if you have worked with any of the [Web Storage APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), specifically the [@wxt-dev/storage](https://wxt.dev/storage) implementation for web extension.

<div class="c-callout c-callout--info">

`createSubscriber` is only available from [Svelte 5](https://svelte.dev/blog/svelte-5-is-alive).
Time to [upgrade](https://svelte.dev/docs/svelte/v5-migration-guide)?

</div>

## Feed me code!

```typescript title="reactive-storage.ts"
import { createSubscriber } from 'svelte/reactivity';
import { storage } from '#imports'; // assuming @wxt-dev/storage is preinstalled in wxt.dev

export const AUTHENTICATED_KEY = 'local:authenticated';

export class ReactiveStorage {
	#authenticated: boolean | null;
	#subscribeToAuthenticated: ReturnType<typeof createSubscriber>;

	constructor(init: { authenticated: boolean | null }) {
		this.#authenticated = init.authenticated;
		this.#subscribeToAuthenticated = createSubscriber((update) => {
			const unwatch = storage.watch<string>(AUTHENTICATED_KEY, (value) => {
				this.#authenticated = value;
				update();
			});
			return unwatch;
		});
	}

	get authenticated() {
		this.#subscribeToAuthenticated();
		return this.#authenticated;
	}

	set authenticated(value: boolean | null) {
		storage.setItem<boolean>(AUTHENTICATED_KEY, value);
	}
}
```

The code above is quite verbose and only handles the `authenticated` item. It will get longer as I add more items to the storage. An abstraction on top to automate the subscription and getter/setter setup for each item is certainly possible. I'm yet to find a need for that, however, as abstraction does also mean less flexibility. Plus I'm too lazy to work out the necessary Typescript generics for this :-).

## Initialization with Svelte Context

Say I have a [popup entrypoint](https://wxt.dev/guide/essentials/entrypoints.html#popup) that needs to use `ReactiveStorage` within it, I can further wrap it in a Svelte context to avoid prop drilling:

<enhanced-code-block group display="files">

```typescript title="popup/popup.ts"
import { mount } from 'svelte';
import { storage } from '#imports'; // assuming @wxt-dev/storage is preinstalled in wxt.dev
/// :::diff +
import { ReactiveStorage, AUTHENTICATED_KEY } from '@/reactive-strorage.ts';
/// :::
import Popup from './popup.svelte';

(async function() {
  mount(Popup, {
    target: document.getElementById('app')!,
    /// :::diff +
    context: new Map([
      [
        'storage',
        new ReactiveStorage({
          authenticated: await storage.getItem<boolean>(AUTHENTICATED_KEY),
        }),
      ],
    ]),
    /// :::
  });
})();
```

```svelte title="popup/popup.svelte"
<!-- :::diff + -->
<script>
  import { getContext } from 'svelte';
  import type { ReactiveStorage } from '@/reactive-storage.ts';

  const storage = getContext<ReactiveStorage>('storage');
</script>

<p>
  {#if storage.authenticated}
  Authenticated
  {:else}
    Not authenticated
  {/if}
</p>
<!-- ::: -->
```

```html title="popup/index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Your Extension</title>
		<meta name="manifest.type" content="browser_action" />
	</head>
	<body>
		<div class="contents" id="app"></div>
    <!-- :::highlight -->
		<script type="module" src="./popup.ts"></script>
    <!-- ::: -->
	</body>
</html>
```

</enhanced-code-block>

The same setup is needed for each UI entry point in my extension.

<div class="c-callout c-callout--success c-callout--icon-confetti">

Whenever I make changes to the `authenticated` item in the extension storage, the markup code should automatically update. That includes changes made to extension storage from background or content scripts, or even manually through the browser devtools. Pretty neat!

</div>

Taking advantage of storage reactivity is also a viable alternative to passing message around,
between content script <-> background <-> popup, for example.

## Your `getItem` might be async

Note in a previous code block, the initial `authenticated` value is passed into `ReactiveStorage` instance at initialization...

```typescript title="ReactiveStorage instantiation"
const reactiveStorage = new ReactiveStorage({
  authenticated: await storage.getItem<boolean>(AUTHENTICATED_KEY),
});
```

...and not handled internally within `ReactiveStorage`. This is my personal choice, but also because `storage.getItem`, in this particular implementation I'm using, is `async`. Getting values inside constructor is doable but then we won't know for sure when the fields are populated, hence some possible flash of content. I prefer to have the values ready immediately when `ReactiveStorage` is instantiated.

This async behavior is also why I use an intermediate private `#authenticated` field instead of calling `storage.getItem` directly in the getter:

```typescript title="ReactiveStorage.authenticated"
class ReactiveStorage {
  get authenticated() {
    this.#subscribeToAuthenticated();
    return this.#authenticated;
  }
}
```

Lastly, note the async [Immediately-Invoked-Function-Expression (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) in `popup/popup.ts` to avoid top-level await, which might not be supported in all browser versions:

```typescript title="popup/popup.ts - truncated"
(async function() {
  //...
  const authenticated = await storage.getItem<boolean>(AUTHENTICATED_KEY);
  // ...
})();
```

Your mileage may vary, check your storage implementation and do what feels right for you!

## Usage in Scripts

`ReactiveStorage` may work in other contexts other than Svelte files. However, I currently only have the need for it inside Svelte land. In scripts, I'd just use the `storage` API directly. But if you come up with some cool use case, please let me know!

## Closing

I hope this has been helpful. The implementation I shared is just a few days old, and I got too excited too fast. You can find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com) or via our [Svelte Vietnam Discord](https://discord.sveltevietnam.dev). Any feedback is well appreciated.

Svelte 5 has been a true step-up for productivity in my daily work. Couple that with [wxt.dev](https://wxt.dev/) and the Vite ecosystem today, I can't really ask for more. To the people that maintain these frameworks, you rock! Go give them support if you can!

