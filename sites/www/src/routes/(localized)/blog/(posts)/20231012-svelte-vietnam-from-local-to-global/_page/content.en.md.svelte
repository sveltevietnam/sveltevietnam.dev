What is Svelte Vietnam? How does it come about? And why is it even necessary? Let’s get to bottom of these questions in this post.

## Context

I started the Svelte Vietnam project in December of 2022. Two years before that, I accidentally came to Svelte during my research for a project at work, in which I was trying to refactor and improve an application written in React and Electron.

My objective then was not to replace React, but to restructure and apply optimization to enable performance and better developer experience. I was trying to set up Hot Module Replacement because every time we changed code, it took forever for everything to rebuild. And there I was down the rabbit hole: one thing led to another, I decided to try [Snowpack](https://www.snowpack.dev/tutorials/svelte)*. Snowpack is a build tool that can replace webpack; it utilizes ES module to serve code unbundled during development. You can read more about it [here](https://www.snowpack.dev/concepts/how-snowpack-works) but to keep it short, it was innovative in its time and really, really fast. At the same time, the Svelte community was interested in similar ideas and had close collaboration with the Snowpack team (you can read [this old issue](https://github.com/sveltejs/sapper/issues/1204) to know more). Rich Harris, author of Svelte, had also said good things about Snowpack. So I also became interested in this (relatively new) Svelte thing and decided to give it a try. Before I could know it I was in too deep with Svelte.

Back to 2022, this was an important year for Svelte. [Rich Harris](https://github.com/Rich-Harris) had quit his full-time job to [join Vercel](https://vercel.com/blog/vercel-welcomes-rich-harris-creator-of-svelte), followed by [Simon](https://github.com/dummdidumm). These two with other members from the Svelte core team really pushed forward development of [Svelte Kit](https://svelte.dev/blog/sveltekit-beta), an innovative metaframework for Svelte (think Next for React or Nuxt for Vue). The Svelte community, during all of this, had been expanding quickly both in breadth and depth ([Svelte Discord](https://svelte.dev/chat), [Svelte Society](https://sveltesociety.dev/), [Svelte Radio](https://www.svelteradio.com/), [Svelte Summit](https://www.sveltesummit.com/), [Svelte Sirens](https://sveltesirens.dev/), and many more local communities around the world). In December, [Svelte Kit 1.0](https://svelte.dev/blog/announcing-sveltekit-1.0) was finally and officially released. All signs led towards an unprecedented global interest growth and adoption of Svelte. In Vietnam where I was based, the local Svelte community at this time was fragmented or hardly present. This is the reason why the Svelte Vietnam project was created.

::: div c-text-cap2
\* Snowpack is no longer maintained. [Vite](https://vitejs.dev/), which came from the Vue community, has become somewhat of a standard. Today, Vite and Svelte communities have a strong connection similar to how Snowpack and Svelte used to do.
:::

## An Open Source Project

Svelte Vietnam is an open source project. To be more precise, it is a collection of open source projects contributed by community and governed by the [Svelte Vietnam Github Organization](https://github.com/sveltevietnam). At the time of this writing, all source code of Svelte Vietnam, including this site you are reading, is public. Everyone can access and contribute to this source code.

So then why open source? Why not? Think about it, perhaps over 90% (a number I pick randomly without any evidence) of developers’ daily work, especially on the web, is made possible by open source code. We are used to, conveniently, installing a dozen of packages right after starting a project; each package would be installing another dozen of packages. As a result, our production build is written more by others than by ourselves. Contributing to open source and learning from it is one way for us to grow professionally.

Svelte Vietnam is open source and will always encourage its members to participate in open source projects. If we do it right and are fortunate enough, Svelte Vietnam can be the first stop for some developers on their journey as open source contributors.

## A Community

Svelte Vietnam is a community for anyone interested in Svelte and open source. We have an official [Discord](https://discord.sveltevietnam.dev/) as the main communication platform, as well as the [Svelte Vietnam Blog](/blog) as a place for members to share in the form of writing. In the future, Svelte Vietnam plans to organize online and offline meetups, and events with formats learned from Svelte Summit and other communities. Through these channels, my hope is that members will have opportunities to connect and share their experience and knowledge.

### Collaboration. Not Competition

Svelte Vietnam does not intend to compete with other communities in Vietnam like Vue or React. If you have joined Discord, you might have noticed my pinned message saying that everyone can be free to express and discuss but should avoid nonconstructive comparison between technologies. The fact is, we cannot avoid comparison. It is necessary to compare and analyze similarities and differences; but we sometimes get so caught up with differences that we cannot see similarities. Recently, members from a lot of different communities have come together for [Vite Conference](https://viteconf.org/23/); none of them would seriously say “because Vite is from Vue, I refuse to use it". Another example is the announcement just last month from the Svelte team about [Rune](https://svelte.dev/blog/runes), we have learned that Svelte has drawn inspirations from many other frameworks. Most of the major frameworks today implement, in one way or another, Signal, a technology that can be tracked back to [Knockout](https://knockoutjs.com/) more than a decade ago. When a framework succeeds, all others succeed. It does not always have to be winners and losers. We are more alike than we can realize.

Svelte Vietnam always welcomes members from other communities, and encourage our members to join them and come back with suggestion or criticism against our own community.

Building a community is no easy task. You might wonder why we are creating yet another community instead of just being part of the existing ones: we need something to connect, that is the reason. I have seen members in the same team having conflict, listened to a backend dev arguing with a frontend one. If disagreements can exist in such cases, a Svelte dev and a C++ dev might not be able to empathize at all, even if we put them in the same room right next to each other (I know, one should not be just a Svelte or C++ dev, but you get what I’m trying to say). Svelte is simply a vehicle for members in our community to better connect. From there, we can take the conversation to the web platform, software engineering, open source, and much more beyond our community.

## A Social Experiment

In the near future, I will be submitting a request to initiate an [Open Collective](https://opencollective.com/)* dedicated to Svelte Vietnam. This is our current financial solution. I believe without money, we are handicapped. Finance helps us organize events and pay for infrastructure to ensure quality and security. If we are really fortunate, we might be able to bring local companies and institutions into the scene. Investing in the community means investing in innovation and the development of the industry as a whole. We might even be able to start sponsoring local individuals or teams that have important contribution to open source, regardless of the ecosystem and not just Svelte.

As you might have already seen, Svelte Vietnam differs itself from other local communities in some key organization and technical decisions. Nevertheless, this organization model is not new. Recently, Github has expanded its [Sponsor](https://github.blog/2023-10-03-sponsors-is-expanding/) program to 35 new regions, including Vietnam. Events from Svelte, Vue, React, … also rely on sponsorship. More and more platforms (Patreon being a prominent example) are investing in individual creativity, independent creators, and local communities. Programmers like us can be creators too. After all, we are not that different compared to a youtuber or tiktoker.

However, is the Vietnam community ready for all of this? Most of my colleagues do not care that much about such topics. They are not really to blame; everyone has families and their own life to live. But perhaps they lack a precedent.

Svelte Vietnam, therefore, is my personal social experiment. I am tempted to know whether my reasoning, as I have laid out in this post, is grounded and sufficient. Two years from now, there might be a part two to this post; it is certain that a lot if not most of the arguments here will become outdated, but I hope that what I am doing right now will still be of value.

::: div c-text-cap2
\* Open Collective is a platform for fundraising and managing sponsorship with high transparency. All financial contributions and spending are made public. This is one of the primary reasons why I choose it.
:::

## A Question Mark

Up until now, I have answered the question “What is Svelte Vietnam” through a very subjective lens. In such an early stage as now, I want Svelte Vietnam to be all of the above. However, Svelte Vietnam will change to whatever its community deems fit. For now it is just some drawing and paragraphs in my personal notebook. But it is the community that can mold Svelte Vietnam into its specific shapes and colors. These colors and shapes are unforeseeable. Svelte Vietnam is a question mark that I will observe curiously every day.

## Summary

In a sentence, Svelte is an open source project, an inclusive community, a social experiment, and anything its community wants it to be. My hope is that members of Svelte Vietnam will start local, stay humble, and go global.
