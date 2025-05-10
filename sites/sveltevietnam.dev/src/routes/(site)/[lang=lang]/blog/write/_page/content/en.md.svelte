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

