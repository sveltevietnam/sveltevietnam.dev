# Blog Post: Implementation Guidelines

This document provides instructions to implement a blog post. Alternatively,
you may submit a [Proposal for Blog Post Publication](https://github.com/sveltevietnam/sveltevietnam.dev/issues/new/choose)
if you are not able to code it yourself.

The proposal mentioned above helps you focus on the content and delegate the implementation to maintainers. On the other hand, coding it yourself provides more flexibility and quality control over your entire blog post.

## Getting Help

If you get stuck and this document does not help, reach out to our maintainers at the [#blog channel in Svelte Vietnam discord](https://discord.com/channels/1066621936546877450/1140975328781676616).

## Steps

1. Clone the repo, and follow [DEV_SETUP](./DEV_SETUP.md) to get the site running on local dev.
2. Run `pnpm post:create` at `sites/www` directory, and follow the prompts to setup a new blog post.
3. Use git to track newly generated files and start from there:

   - add content in `(posts)/[slug]/_page/content.*.md.svelte`,
   - add metadata in `(posts)/[slug]/_page/data.ts`, inspect types and play around to see what options are available,
   - generally, other files can be ignored, but feel free to add your own customization / adjustments should it be necessary.

   For components that are only used within your blog post, declare in `(posts)/[slug]/_page/components/*.svelte`.

4. Open a PR when you have finished development.

## Architecture

We do not have a content management system (CMS), special dashboard, editor, or database for blog posts. Another way to look at it is that we are using Github as our CMS and database. Each blog post is a [svelte-kit route](https://kit.svelte.dev/docs/routing#page) located at `sites/www/src/routes/[[lang]]/blog/(posts)/`.

With this strategy, we can be very flexible about how a blog post is implemented. Each post is a unique page, even if it follows a common layout structure or directory format. That means we can make full use of web technologies for data visualization, interactive elements or complex user interface in post content.

This strategy also reduces maintenance effort and cost of a CMS system while prompting people from the community to directly involve in the source code. However, the tradeoff is increased complexity in the publication process, and duplication of boilerplate code.

For convenience, [MdSvex](https://mdsvex.pngwn.io/) is setup for `*.md.svelte` files (thanks @pngwn). That means Markdown syntax is supported in said files, so we should make use of that.
