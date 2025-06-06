<script>
  import Playground from './code/playground.svelte';
  import Configuration from './code/configuration.svelte';
</script>

Following the spirit of fully utilizing (and abusing to the best of my ability) Svelte 5 reactivity,
as discussed in the article ["Reactive Wrapper for WXT Extension Storage with Svelte's createSubscriber "](/en/blog/20250425-mini-snippet-reactive-extension-storage-wxt), I want to share a solution that wraps [WebStorage] (`localStorage` and `sessionStorage`) to provide a nicer development experience in Svelte projects.

## Feed me code!

Copy the following code into your project...

```ts title="lib.ts" src="./code/lib.ts"
```

...and do something like this:

```ts title="storage.ts" src="./code/storage.ts"
```

`storage.num`, `storage.sr`, etc. are now reactive 🎉!

## Prior Arts

Please have a look at [this Reddit
discussion](https://www.reddit.com/r/sveltejs/comments/1d43d8p/svelte_5_runes_with_localstorage_thanks_to_joy_of/)
and the [proposed solution by Joy of Code](https://www.youtube.com/watch?v=HnNgkwHZIII), as well as
[this test code by Rich Harris](https://github.com/Rich-Harris/local-storage-test/blob/91472fa04e135a64316db42aae69bec4d6944ca7/src/lib/storage.svelte.ts). These solutions are all useful, but they do not fully meet my requirements (but may do yours). Plus, with the relatively new [createSubscriber] API, I want to revisit this problem space.

## Objectives

The solution presented here is designed to address the following objectives:

1. Provide reactivity via the simplest possible abstraction for [WebStorage] items,
2. Automate `JSON.stringify` and `JSON.parse` when storing and retrieving data from [WebStorage],
   since `localStorage` and `sessionStorage` currently only support storing values as strings,
3. Just works™. In concrete terms, that means minimal boilerplate and doesn't crash on server side.

## Experimentation

You may try out my solution in this section (or via [this Svelte
REPL](https://svelte.dev/playground/6379413bef66424ca744245d9174c2d2?version=5.33.14)).
To start out, have a look at the following visual representation for the designated configuration of the `storage` object:

<Configuration />

The code needed to create the `storage` object is listed in the `storage.ts` code block in the ["Feed
me code!"](#feed-me-code) section. Next, use the following playground and try changing the values of the
items:

<Playground />

<div class="c-callout c-callout--success c-callout--icon-bulb">

Try having two different tabs/windows open and observe the values being synchronized in all
documents.

</div>

Expand the following code block if you want to see the actual source code of the playground above:

```svelte title="playground.svelte" src="./code/playground.svelte" collapsed
```

## API Design

It's hard to say how to strike a balance when designing an API that is both simple and performant
in architecture, while also providing the most ergonomic and friendly API experience. In this
particular case, one of my requirements is that the created `storage` should be as "normal" as a
plain old Javascript object is, which practically means its properties can referenced directly
(e.g. `storage.field`) without any intermediate layer (e.g. `storage.field.current`):

```svelte
<input type="text" bind:value={storage.str}>
```

Next, I want to be able to initialize multiple storage items in a single centralized  `storage` object,
rather than having one object per item:

```ts title="centralization"
// :::diff -
const str = new ReactiveStorageItem('str');
const bool = new ReactiveStorageItem('bool');
// :::
// :::diff +
const storage = new ReactiveStorage(['str', 'bool']);
storage.str; storage.bool;
// :::
```

Plus, I want to utilize as much as possible Typescript's support for type checking, but without
depending on too much magical generics & inference:

```ts title="manual type declaration"
type StorageValue = {
  str: string | null;
  num: number | null;
  /* ... */
};
// :::highlight
const storage = new ReactiveStorage<StorageValue>({ /* ... */ })
// :::
storage.str; // <-- string
stroage.num; // <-- number
```

## Should I make this into a library?

I have a tendency to wrap this kind of code snippets into libraries for easier grab-and-go
resuability — similar to the libraries I maintain at the
[@svelte-put](https://svelte-put.vnphanquang.com) collection. However, I haven't used this solution
enough to evaluate its practicality and stability.

There are quite a few issues to consider when packaging a solution like this into a library. A few
examples:

- what to do when encountering a runtime error, such as when `JSON.parse` fails during data
retrieval,
- should I provide an `onchange` mechanism, such as through some
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent),
- how do I test this library code.

If you think this is a useful solution and should be packaged into a library, please let me know!

## Closing

To avoid being too verbose, I didn't go into much details for the source code in this article.
Any feedback or suggestion is well appreciated. Should you want to have a chat,
please find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com)
or through the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

In any case, I hope this solution is useful to you. Thank you for reading!

[createSubscriber]: https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber
[WebStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
