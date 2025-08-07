<script>
  import SectionSop from './sop/en.md.svelte';
  import SectionSyntax from './syntax/en.md.svelte';
  import SectionDataEdit from './data-edit/en.md.svelte';
</script>

## Technical Design Overview

The Svelte Vietnam Blog is a static site: its data is part of the source code, and blog post
contents are written in Markdown and Svelte syntax. The process of writing and publishing a blog
post shares much similarities with a typical daily software development workflow and does not
depend on any third party database or fancy editor ([WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG),
Markdown editor, rich text, etc.). In a way, the Svelte Vietnam Blog uses Git as its
[CMS](https://en.wikipedia.org/wiki/Content_management_system).

This design requires *writers* to have some basic experience with web development, but it also helps
reduce significantly the infrastructure cost and human resources needed to maintain the blog.

## For non-technical writers

If you are looking for ways to contribute to the Svelte Vietnam Blog but are not familiar with the
technical aspects listed here, please feel free to reach out to administrators via the
[official Svelte Vietnam Discord server](https://discord.sveltevietnam.dev), or send your blog post
in any traditional text format (`txt`, `pdf`, `docx`, etc.) to blog@sveltevietnam.dev.

<h2 id="directory-structure-of-a-post">Directory Structure of a Blog Post</h2>

Each blog post is a collection of files located under a
`sites/sveltevietnam.dev/src/data/blog/posts/:id` directory:

```raw
  sites/sveltevietnam.dev/src/data/blog/posts/:id
    │
    ├── metadata.ts       <-- main data definition
    │
    ├── content/
    ┆   │
    ┆   ├── en.md.svelte  <-- content in English
    ┆   └── vi.md.svelte  <-- content in Vietnamese
    │
    ├── images/
    ┆   │
    ┆   └── thumbnail.jpg <-- thumbnail and social sharing image
    ┆   └── ...           <-- any other images used in the post
    ┆
    ├── ...               <-- other data used in the post
```

<SectionSop />
<SectionSyntax />
<SectionDataEdit />

## Adding Comments

At the moment, each blog post can be linked to a [Bluesky](https://bsky.app) post. When linked, a
blog post will have a comment section that displays replies from Bluesky. To initiate this, you can
either:

1. create a Bluesky post that mentions your published blog post, and send said Bluesky post to the
   administrators, or
2. request the administrators to create a Bluesky post for your blog post, via the
   [Svelte Vietnam account](https://bsky.app/profile/sveltevietnam.dev).

Option (1) is helpful if you want to build your personal Bluesky account and grow your audience. After linkage is
established, the Svelte Vietnam account will *repost* your Bluesky post.

## On Artificial Intelligence (AI)

### AI Usage

Usage of [Generative AI](https://en.wikipedia.org/wiki/Generative_artificial_intelligence) in the
writing process is not prohibited. AI can be helpful for various tasks such as:

- assisting in translating blog posts to other languages,
- generating *alt text* for visual content such as images, diagrams, etc.,
- checking grammar, spelling, and syntax.

However, it is encouraged that you prioritize authenticity, originality, and a personal touch in
your writing. To meet these goals, if you use AI to actively generate content rather than assisting
in secondary tasks such as those listed above, please make sure to:

1. add the following configuration to your [blog post metadata](#updating-post-metadata):

```ts title=".../metadata.ts"
export default defineBlogPostMetadata({
  ai: true,
  // ...
});
```

2. disclose the purpose and usage of AI in your blog post.

### AI Bot and Scraping

The sveltevietnam.dev site implements several measures to discourage AI bots from scraping its content.
We believe this is necessary until sufficient ethical and legal frameworks on AI are established.

We cannot, however, guarantee that your blog post will be completely safe from bots and web scrapers,
especially in today fast-evolving AI landscape.

## License

The Svelte Vietnam Blog is licensed under the [MIT License](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/LICENSE) and as such, your blog post will also inherit the same license by default. If you wish to use a different license for your blog post, please specify it in your blog post content.

## Feedback and Contributions

If you have any feedback or suggestion, please feel free to
[open an issue at Github](https://github.com/sveltevietnam/sveltevietnam.dev/issues),
reach out to the administrators via the [official Svelte Vietnam Discord server](https://discord.sveltevietnam.dev),
or send an email to blog@sveltevietnam.dev.

Thank you, and happy writing!
