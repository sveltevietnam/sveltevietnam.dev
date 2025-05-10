<script>
  import ExampleImage from './example/content/en.md.svelte';
</script>

### Images

The the time of this writing, the project does not support Markdown syntax for images in blog posts.
Instead, please use HTML tags as shown in the following example...

```svelte title="./content/vi.md.svelte" src="./example/content/en.md.svelte"
```

...which will be displayed as:

<ExampleImage />

Recommendations:
  - images should be placed in the `.../images` directory, similar to `thumbnail.jpg`, as shown in
  the ["Directory Structure of a Blog Post"](#directory-structure-of-a-post) section,
  - use the import query `format=avif` to optimize for image size. For more information, refer
  to [imagetools - directives](https://github.com/JonasKruckenberg/imagetools/blob/973606522673ce865081bedc6d08d9deefa21699/docs/_media/directives.md),
  - set appropriate `width`, `height`, and `alt` attributes for the image.

