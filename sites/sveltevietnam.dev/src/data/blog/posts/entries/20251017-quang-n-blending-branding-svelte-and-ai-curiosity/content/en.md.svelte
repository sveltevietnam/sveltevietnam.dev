<script>
  import { ChatContainer, ChatItem } from '$lib/components/chat';
  import { loadParticipants } from '$lib/components/chat/utils';
  import { RoutingContext } from '@sveltevietnam/kit/contexts';

	const routing = RoutingContext.get();
  const participants = loadParticipants(['liti-dev','quang-design'], routing.lang);
</script>

My first impression about Quang was someone who's calm and composed - the kind of person who doesn't rush to speak - but when he does, it's thoughtful.
He's a design director skilled at crafting impactful brand identities, where his work goes beyond aesthetics.

## Firechat with Quang N.

<ChatContainer class="py-2 *:max-w-4/5 flex flex-col mobile:gap-2" participants={participants}>
<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> How did you first discover Svelte or this community?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> I was searching for a lightweight framework to build small web apps. The clarity of Svelte's syntax and its speed just clicked with me. It felt simple, elegant, and approachable.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> One fun fact about you?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> I'm currently working as a design director in a startup (FlexOS), but I'm also trained as a fullstack developer.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> What are you working on?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> I'm building <a href="https://www.quang.design/engineer" rel="noopener">small Svelte apps</a>  using LLM APIs and creating my personal website. Recently, I've also started exploring security in SvelteKit, like working with security headers.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> How do you debug Svelte apps?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> `console.log` everywhere 😄 + asking LLMs when I get stuck

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> What's your Svelte dev setup?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> MacOS, Windsurf IDE, Tailwind CSS.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Most difficult concept?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> Definitely the  Context API which took me some time to really understand how it works.

</ChatItem>
<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> What do you like to see more from our community?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Answer:</span> I'd love to see small building challenges, something hands-on where people learn by doing. A big shoutout to <a href="/en/people/vnphanquang">Quang Phan</a>, who welcomed me to the community even though I'm not a developer. That kind of kindness matters.

</ChatItem>
</ChatContainer>

In this era, where AI increasingly blurs the line between traditional job titles, it's increasingly common to see people like Quang whose goal is to build things that are both aesthetic and efficient, bridging the gap between design and functionality. He's not just a designer who codes or a developer who designs.

<div class="c-callout c-callout--success c-callout--icon-confetti">
We've learned that beneath that quiet exterior is a deeply curious mind, always eager to experiment, learn, and build.
</div>

## Resources Quang N. Recommends

- [Svelte 5 course on Udemy](https://www.udemy.com/course/practical-sveltekit-guide-build-and-deploy-real-world-apps/)

- [Joy of Code](https://joyofcode.xyz/)

- [Huntabyte](https://www.youtube.com/@Huntabyte)

- [Ben Davis](https://www.youtube.com/@bmdavis419)
