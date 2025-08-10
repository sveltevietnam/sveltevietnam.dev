<script>
  import { ChatContainer, ChatItem } from '$lib/components/chat';
  import { loadParticipants } from '$lib/components/chat/utils';
  import { RoutingContext } from '@sveltevietnam/kit/contexts';

  import learning from '../images/effective-learning.jpg?format=avif';

  const routing = RoutingContext.get();
  const participants = loadParticipants(['liti-dev', 'anhtuank7c'], routing.lang);
</script>

When I first met Tuan Nguyen, I noticed I was speaking with a strategist, a systems thinker, and someone who’s been coding for over 15 years. What keeps him going isn't just the thrill of new tech, but the joy of solving diverse problems and turning ideas into working solutions.

Tuan doesn't claim to be a “natural” programmer. In fact, he says:

> I wasn't good at programming at first. But my passion kept me going. I don't hesitate to dig into new things, vertically expanding by deepening my knowledge beside horizontally scaling my skills with other technologies.

When asked about a recent win, he keeps it simple:

> I'm proud I didn't give up when things got tough.

For those who want to level up, he recommends Bloom's Taxonomy as a mental model for personal development.

<figure>
  <img src={learning} class="mx-auto max-w-full" width="573" height="376" alt="bloom's taxonomy" />
  <figcaption>Bloom's taxonomy: a framework for categorizing educational goals</figcaption>
</figure>

Knowing where you are, being curious, having a growth plan, and most importantly: understanding the core business values. Because at the end of the day:

> Code is just a tool to solve business problems and deliver value.

## Firechat with Tuan Nguyen

<ChatContainer class="py-2 *:max-w-4/5 flex flex-col mobile:gap-2" participants={participants}>
<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> How did you first discover Svelte or this community?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> I first discovered Svelte in a video from Fireship on Youtube (a rite of passage for many devs). I was impressed by the theory of how Svelte works, why it is fast compared to other frameworks like React, Vue.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Describe your Svelte journey in one emoji 😄. Why that one?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> 🌟- The glowing star, because it unlocked my mind in working with web development, the browser and the new opportunity. Svelte helped me work more closely with native Web APIs. With React, those APIs often get abstracted away inside a black box, pulling developers further from the web platform itself and we end up chasing React-specific quirks. It's crazy.

<div class="c-callout c-callout--success c-callout--icon-trophy">

Frameworks come and go, but Web API standards are here to stay.

</div>
</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> What are you working on?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> I'm managing a team, occasionally writing tech blogs, learning C and Python, developing AI Web projects with SvelteKit, and maintaining a React Native project.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> How do you debug Svelte apps?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> `console.log`, nothing special, just simple and efficient

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> What's your Svelte dev setup?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> I prefer to use MacOS, vscode with SublimeText keymap, pnpm and Cloudflare ecosystem.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Most difficult concept?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> Probably `@render` when migrating Svelte 4 to Svelte 5. It took me 2 days to figure it out.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> Has your tech choice changed since becoming a CTO?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> I always consider our company's existing resources. Choosing the right architecture is more important than choosing the trendiest tech stack.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> As someone who's managing a React Native community with over 30,000 members, what's your approach on building a community?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> For me, it's the snowball effect: how one small, positive action can ripple outward and create larger, lasting impact.

> Shared experiences and small acts of contribution make the community stronger. That's how we grow: together.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Question:</span> What do you like to see more from our community?

</ChatItem>
<ChatItem participant="anhtuank7c" align="right">

<span class="sr-only">Answer:</span> I'd love to see monthly meetups, just honest, open spaces where people share what they've learned. Hearing someone’s journey might spark the idea for someone else's next project.

</ChatItem>
</ChatContainer>

After this conversation, we’ve learned that what makes a developer stand out isn't flashy tools; it's adaptability and a deep commitment to solving real problems. Whether through clean architecture or community building, he's shaping more than just code - he's shaping culture. We're glad he's part of the Svelte mosaic.

## Resources Tuan Recommends

- [Joy of Code](https://www.youtube.com/@JoyofCodeDev)
- [Skeleton](https://www.skeleton.dev/docs/get-started/installation/sveltekit), [FlowBite Svelte](https://flowbite-svelte.com/)
