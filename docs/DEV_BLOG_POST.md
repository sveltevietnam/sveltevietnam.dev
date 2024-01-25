# Blog Post: Implementation Guidelines

This document provides instructions to implement a blog post. Alternatively,
you may submit a [Proposal for Blog Post Publication](https://github.com/sveltevietnam/sveltevietnam.dev/issues/new/choose)
if you are not able to code it yourself.

The proposal mentioned above helps you focus on the content and delegate the implementation to maintainers. On the other hand, coding it yourself provides more flexibility and quality control over your entire blog post.

## Getting Help

If you get stuck and this document does not help, reach out to our maintainers at the [#blog channel in Svelte Vietnam discord](https://discord.com/channels/1066621936546877450/1140975328781676616).

## General Steps

1. Clone the repo, and follow [DEVELOPMENT](./DEVELOPMENT.md) to get the site running on local dev.
2. Run `pnpm post:create` at `sites/www` directory, and follow the prompts to setup a new blog post.
3. Use git to track newly generated files and start from there:

   - add content in `(posts)/[slug]/_page/content.*.md.svelte`,
   - add metadata in `(posts)/[slug]/_page/data.ts`, inspect types and play around to see what options are available,
   - generally, other files can be ignored, but feel free to add your own customization / adjustments should it be necessary.

4. Open a PR when you have finished development.

Visit the [Design | Blog](https://www.sveltevietnam.dev/en/design/blog) page for more information about the design, conventions, and common components.

## How and where do I make components?

General guidelines

- For components that are only used within your blog post, declare in `(posts)/[slug]/_page/components/*.svelte`.
- If you find a piece of code elsewhere in the codebase that you want to enhance or reuse, declare in `lib/components/`.
- Prefer CSS component (init with cd `sites/www` & `hygen css create`) over JS component when possible. A good indicator is that if your component does not contain complex markup or runtime logics, CSS component is a perfect fit.

## Blog Post Publication Check List

Follow the following check list to ensure your blog post is ready for publication.

- Images:
  - Have a good thumbnail or OG image
  - Optimize all images, ideally use [webp](https://developers.google.com/speed/webp) format
  - Make sure all images are responsive and its aspect ratio is kept (i.e avoid stretching on screen resize)
- Provide in `_page/data.ts` as much metadata as possible, especially `description` and `keywords`, available options can be seen at [lib/data/blog](../sites/www/src/lib/data/blog/index.ts).
- Add entry to [sitemap.xml](<../sites/www/src/routes/(api)/sitemap.xml/+server.ts>) and [rss.xml](<../sites/www/src/routes/(api)/rss.xml/+server.ts>)

## Architecture

We do not have a content management system (CMS), special dashboard, editor, or database for blog posts. Another way to look at it is that we are using Github as our CMS and database. Each blog post is a [svelte-kit route](https://kit.svelte.dev/docs/routing#page) located at `sites/www/src/routes/(localized)/blog/(posts)/`.

With this strategy, we can be very flexible about how a blog post is implemented. Each post is a unique page, even if it follows a common layout structure or directory format. That means we can make full use of web technologies for data visualization, interactive elements or complex user interface in post content.

This strategy also reduces maintenance effort and cost of a CMS system while prompting people from the community to directly involve in the source code. However, the tradeoff is increased complexity in the publication process, and duplication of boilerplate code.

For convenience, [MdSvex](https://mdsvex.pngwn.io/) is setup for `*.md.svelte` files (thanks @pngwn). That means Markdown syntax is supported in said files, so we should make use of that.
