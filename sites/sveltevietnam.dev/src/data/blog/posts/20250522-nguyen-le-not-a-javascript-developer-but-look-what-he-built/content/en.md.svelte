<script>
  import { ChatContainer, ChatItem } from '$lib/components/chat';
  import { loadParticipants } from '$lib/components/chat/utils';
  import { Contexts } from '@sveltevietnam/kit/contexts';

  import summarizer from '../images/summarizer.png?format=avif';

	const { routing } = Contexts.get();
  const participants = loadParticipants(['liti-dev', 'trongnguyen24'], routing.lang);
</script>

When I first connected with Nguyen Le, I was struck by two things: his modesty and the flicker of passion behind every word he typed. There’s a deep sincerity in how he talks about design, web development, and the Svelte community. This is the kind of energy that reminds me that tech is, at its core, deeply human.

Nguyen didn’t come from a traditional CS background.

> At the time, I only knew HTML/CSS and was looking for something to help turn my designs into real websites.

That “something” turned out to be Svelte. Thanks to a Fireship video (I’m a huge fan, too), he started his journey with Svelte and never looked back. The simplicity of the syntax and the ease of diving in clicked with his design-first mindset:

> It feels like working with plain JavaScript, HTML, and CSS.

## Firechat with Nguyen Le

<ChatContainer class="py-2 *:max-w-4/5 flex flex-col mobile:gap-2" participants={participants}>
<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> One fun fact about you?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Answer:</span> I can build apps but I don’t consider myself a JS developer. I still look up even basic JS functions, using resources like MDN, W3C. Proof that Svelte is very intuitive and easy to use, right?

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Describe your Svelte journey in one emoji

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Answer:</span> 🔥 Svelte really fired up my passion for web dev. It helps me turn my designs into functional apps

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> If you could pair-program with anyone? Who?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Answer:</span> Hard to pick! I admire a lot of people in the field of UI/UX, programming, and 3D, but usually, I work alone. However, if I have to choose one, that would be [Adam Argyle](https://nerdy.dev/).

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Debugging approach?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Answer:</span> Tabs open: Svelte docs, Chrome DevTools, Gemini chat. Sometimes I even talk to Cline 😑.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Most difficult concept?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Answer:</span> Probably the new Runes concepts, because I'm used to the simple variable declarations of Svelte 4. Perhaps what I've done only involves the basics, so I haven't touched the really difficult parts yet.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Recent favourite Svelte snippet?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Answer:</span> I love using [#key](https://svelte.dev/docs/svelte/key) in Svelte for smooth page transitions. It's so easy and satisfying.

```svelte title="#key block"
{#key data.pathname}
	<PageTransition/>
{/key}
```

</ChatItem>

</ChatContainer>

What Nguyen may not say outright is how resourceful he is. He said that he doesn’t really know JavaScript. Yet this “non-JS developer” built a full Chrome extension called [Summarizerrrr](https://github.com/trongnguyen24/Summarizerrrr) that summarizes YouTube videos, Reddit threads, and more, an idea born from his desire to save time and scratch his own itch.
<figure>
  <img src={summarizer} class="mx-auto max-w-full" width="573" height="376" alt="screen capture: how chrome extension summerizer works" />
  <figcaption>Chrome extension: Summasizerrrr</figcaption>
</figure>

<div class="c-callout c-callout--success c-callout--icon-trophy">
Nguyen’s story is a quiet spark in the big Svelte mosaic. It’s not about being perfect, or fast; it’s about showing up with care, making things for others, and learning your way through.
</div>

We could all use a bit more of that spirit.

## Resources Nguyen Recommends

- [Google’s guide to modern web development](https://web.dev/)
- [UI/UX philosophy and techniques](https://rauno.me/craft)
- [Web Interface Guidelines](http://interfaces.rauno.me)
- [Nerdy.dev](https://nerdy.dev/) – Modern CSS tips from Adam Argyle
- [Josh W Comeau](https://www.joshwcomeau.com/) – Great deep dives into Flex, Grid, and frontend magic

<div class="c-callout c-callout--success c-callout--icon-confetti">

Support Nguyen by trying his extension and star his repo:

👉 [Summarizerrrr on GitHub](https://github.com/trongnguyen24/Summarizerrrr) <br />
👉 [Summarizerrrr on Chrome Web Store](https://chromewebstore.google.com/detail/summarizerrrr/ahfjndakflcegianjdojpldllodpkkpc)

</div>
