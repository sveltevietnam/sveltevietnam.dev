<script lang="ts">
  import authorsImg from './images/authors.webp';
  import confusedManImg from './images/confused-man.webp';
  import creativePaperImg from './images/creative-paper.webp';
  import ctaWriteImg from './images/cta-write.webp';
  import hardcodedDataImg from './images/hardcoded-data.webp';
</script>

When visiting the Svelte Vietnam Blog, you might have wondered how a post is created and stored. You might also have noticed that the Svelte Vietnam website does not have an authentication or user management system. Let’s think about it for a second: publication process in a lot of blog platforms (the most popular being Wordpress) and social media (Facebook, Twitter, Instagram, …) often requires an authentication step and a dedicated editor. What about posts from Svelte Vietnam?

The answer is that the Svelte Vietnam Blog (will be abbreviated as Blog from now on) does not require authentication, nor does it have any dedicated editor. In short, Blog is a collection of static web pages, each of which is hard-coded and stored as source code at Github. Following this strategy, we have been able to reduce infrastructure complexity and costs, as well as some technical limitations. Of course, this design also gave rise to challenges in publication process and lack of familiarity for traditional writers.

In this post, we will discuss more about those pros and cons from this design.

## Strategies for Creating Blog Posts

Before we dive any deeper, let’s review the current methods for creating a blog post:

1. [Send a proposal for blog post publication](https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog%2Cblog%3Apending&projects=&template=en_blog_post_proposal.yaml&title=Blog+Post+Proposal%3A+%3Cshort+title+of+blog+post%3E) : writer sends post details via a Github issue. Its content will be reviewed by administrators and then passed on to developers to implement into the codebase.
2. Code a post: writer is the developer for their own post, then requests a review through Github pull request.

Writers can also [request to link relevant external posts from other platforms](https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog&projects=&template=en_external_blog_post_link_request.yaml&title=External+Blog+Post+Link+Request%3A+%3Cshort+title+of+blog+post%3E), or contact administrators via [Discord](https://discord.sveltevietnam.dev/) or [blog@sveltevietnam.dev](https://www.notion.so/VI-Behind-the-Screen-blog-ch-y-b-ng-c-m-v-code-6ddf53f746334fc0ad039c59fb29f7c4?pvs=21) for other inquiries.

## Writer. Coder

<img
  src={authorsImg}
  alt="authors"
  loading="lazy"
  decoding="async"
  class="h-[320px] mx-auto rounded w-auto max-w-full"
  height="320"
  width="570"
/>


You can see that the design of Blog and the primary strategies for creating posts mentioned previously are all targeted at writers who already have technical knowledge, at least those who can interact with Github. Currently, we do not have enough data to determine whether this approach is practical or not. But with an educated guess that the majority of members from the Svelte Vietnam community are developers, such tasks are likely to already be part of their daily work. Therefore, even though this publication procedure is new when compared to traditional ones (via login & rich-text, user-interface-based editors), I hope writers will either feel right at home or can get up to speed quickly and enjoy the freedom that Blog allows.

To be more specific, (1) will help members gently ease themselves into the atmosphere of a typical open source project by having interaction and communication via Github - a popular software code hosting and project management platform. (2) helps members fiddle directly with our source code, encouraging code-reading skills and more active contribution and collaboration in a medium-scaled project.

Of course, we must acknowledge that users still need to login to either Github or [Discord](https://discord.sveltevietnam.dev/) (or somewhere to send an email). But these platforms are quite popular and we can assume with reason that using them are more convenient than having to sign up and into yet another completely new system.

## Suprastructure. Infrastructure

During the last decades of software innovation, people have adopted solutions to *abstract away part of the complexity* of computer programs via graphical user interface (GUI). GUI is not new, but it has become mainstream and much more popular than text-based interface (TUI), especially for regular users, thanks to its visual capabilities. Instead of relying on HTML, CSS, and Javascript to create a website, people use Wordpress and its plugins (which help with most of everything, more than we can expect). Designers have used Dreamweaver, Wix, and other similar software to replace tasks traditionally assigned to developers. And instead of hiring a whole IT department, corporations are using services from Salesforce or ServiceNow. For the purpose of this post, I will call these solutions collectively as “no-code”, meaning they do not require much programming or technical knowledge.

It is important to emphasize the undeniable values that “no-code" solutions have provided. More users can now access more software than ever thanks to them. However, I used the phrase “*abstract away complexity*” to describe these solutions, and not “remove complexity”, because the complexity never went away. There still needs to be developers and maintainers of systems such as Wordpress, Wix, and ServiceNow. Let’s take a bit of a detour, shall we? Imagine you need to know what files you have in a folder, instead of typing `ls` or `dir` into a terminal and expect a list of files, you might (very likely) open graphical programs such as file explorer, finder, … and let your CPU, GPU draws out pixels of circular, rectangular, triangular shapes of many colors. And so the complexity has shifted, from asking users to remember the commands and read the text output, to developers of operating systems to be able to draw such pixels (and also for corporate design teams to decide what colors and shapes to draw them in). Ironically, we still need to ask users to remember where to click to turn on this new software. In this very out-of-context example (thanks for bearing with me through it), we can say that people created even more complexity than they abstracted.

<img
  src={confusedManImg}
  alt="confused man"
  loading="lazy"
  decoding="async"
  class="h-[320px] mx-auto rounded w-auto max-w-full"
  height="320"
  width="570"
/>

Perhaps it is because developers have to remember `ls` and also file explorer to achieve the same task, and much much more similar things, they have gradually become a bit mad and think that everything needs to be more complex. Instead of building a simple static website, we would design a gigantic suprastructure with all the new shiny technologies in true end-to-end fashion (frontend, backend, testing, database, docker, kubernetes, …), all of which is to serve only a couple of users each month including ourselves with three different browsers.

If Wordpress is “no-code”, then our Blog is “yes-code” by the rationale already discussed. If most writers are developers - those who already know the `ls` command - then who are we abstracting the complexity for? If we know that hard-coding a blog post is fast, easy, and free, then why would we need a content management system? By removing unnecessary abstraction, we can avoid complexity for administrators in system maintenance and lower the infrastructure cost. The source code is also more accessible because now you only have to run a few commands to replicate a working environment rather than rely on third-party services to emulate an otherwise heavy-weighted infrastructure. And finally, writer and coder can code and write instead of learning a new editor with new features and buttons that, when clicked, would explode the whole system because the editor maintainer obviously “did not have time to account for this edge case” as they usually say in explanation to product owner during incident postmortem sessions.

<svg inline-src="./images/tech-and-bug" class="my-8 mx-auto h-[320px]" />

## Let’s go with the flow

So then what are the challenges when building a Blog upon minimal infrastructure without popular abstraction layers?

**Firstly**, there will be code duplication. Some code fragments, especially for setup or data storage, will be duplicated every time a new blog post is created. Instead of packaging data into database and schema, we have to store them as plain, raw code.

<img
  src={hardcodedDataImg}
  alt="hard-coded data"
  loading="lazy"
  decoding="async"
  class="w-full h-auto mx-auto rounded"
  height="320"
  width="570"
/>

This can also lead to inconsistency and incohesion between data among different posts. If changes arise, refactor is difficult and time-consuming. Currently, Blog is using [hygen](http://www.hygen.io/) as a scaffolding tool to automate part of the post creation process, ensuring an initial consistency. Besides, [MDSvex](https://github.com/pngwn/MDsveX) is set up to utilize Markdown syntax in post content, simplifying common and verbose HTML code blocks.

**Secondly**, there is an absence of prebuilt components. A typical editor would provide out-of-the-box common components such as link, image, video, table, … Such components are not (or not yet) available in Blog. This is intentional simply because there is not yet demand for them. As Blog grows, code segments that are used multiple times will incrementally become reusable components. Instead of one person making components for everyone to use, let’s try to make our own components. Only then, at some point, we will revisit, reconcile, find patterns, and extract into common components.

Besides, apart from the “**[Blog Post: Implementation Guidelines](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md#blog-post-implementation-guidelines)”** document, you will not find any  rule book. As the project matures, there will inevitably be conventions and minimum rules that one has to follow to ensure consistency and efficiency of the publication process. However we always try to not limit writers’ creativity. In other words, every new blog post is a blank canvas, there will be previous posts for you to refer to, but what you write or code is up to you.

<img
  src={creativePaperImg}
  alt="creative blank paper"
  loading="lazy"
  decoding="async"
  class="h-[320px] mx-auto rounded w-auto max-w-full"
  height="320"
  width="570"
/>

## Please give me a little bit of complexity

Fortunately, we are using Svelte. Its simple syntax that is close to vanilla technologies (HTML, CSS, Javascript) help writers feel a sense of familiarity and comfort when having to work with code. Libraries and platforms have also evolved rapidly to help developers better optimize their productivity. We use Typescript to add complementary features for Javascript, Tailwind to make writing CSS “easier”, Cloudflare to realize performant and secure infrastructure. Behind those technologies is a lot of complexity as well as amazing teams and individuals. So, if you still need a bit more complexity in you life, make sure to take time to learn more about and contribute to those communities!

## Summary

In a few words, the Svelte Vietnam Blog is a yes-code platform; each blog post is hard-coded and stored at Github. We do not have an editor or any CMS, nor do we need a super complex infrastructure. The reason is that we do not have the demand for such large-scale tooling and technologies. Simplicity and creativity are the key factors that I focus on when developing this site. Please write yourselves some blog posts if possible. All feedback are much appreciated. Thank you!

<img
  src={ctaWriteImg}
  alt="let's write"
  loading="lazy"
  decoding="async"
  class="h-[400px] mx-auto rounded w-auto max-w-full"
  height="400"
  width="600"
/>
