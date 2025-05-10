## Data Definition & Edit

Following ["Overview of the writing process"](#writing-process), post and author data can be
initialized with the help of the `pnpm create:post` and `pnpm create:person` commands. However, you
may review and edit this data at any time.

<h3 id="updating-post-metadata">Updating Post Metadata</h3>

As mentioned in ["Directory Structure of a Blog Post"](#directory-structure-of-a-post),
data definition for a blog post is located at `sites/sveltevietnam.dev/src/data/blog/posts/:id/metadata.ts`.
For example, the metadata for the post ["Come for Svelte, Stay for the
Web"](/en/blog/20240420-come-for-svelte-stay-for-the-web) is defined as follows:

```ts title="20240420-come-for-svelte-stay-for-the-web" src="../../../../../../../../data/blog/posts/20240420-come-for-svelte-stay-for-the-web/metadata.ts"
```

Once you have completed the writing process (step 1 -> 4), make sure you revisit the corresponding
`.../metadata.ts` and update the necessary fields, such as `readMinutes` and `numWords`.

#### Post Thumbnail

To set a custom thumbnail for a blog post, simply add the image as `thumbnail.jpg` to the
`.../images` directory, as listed in ["Directory Structure of a Blog
Post"](#directory-structure-of-a-post). Some guidelines and recommendations are as follows:

- the image should be in JPEG format and named `thumbnail.jpg`,
- it should have a minimum width of 2240px,
- it should have an aspect ratio of 16:9,
- it should be minimalistic, and without too much text.

<h3 id="updating-author-data">Updating Author Data</h3>

Author data is defined at `sites/sveltevietnam.dev/src/data/people/:id/index.ts`. For example, data
for ["Quang Phan"](/en/people/vnphanquang) is defined as follows:

```ts title="20240420-come-for-svelte-stay-for-the-web" src="../../../../../../../../data/people/vnphanquang/index.ts"
```

