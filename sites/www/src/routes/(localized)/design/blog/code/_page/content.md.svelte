<script>
  import Single from './examples/single.md.svelte';
  import SingleOneLiner from './examples/single-one-liner.md.svelte';
  import SingleWithFilename from './examples/single-with-filename.md.svelte';
  import FromFile from './examples/from-file.md.svelte';
  import MetaBlockDiff from './examples/meta-block-diff.md.svelte';
  import MetaBlockHighlight from './examples/meta-block-highlight.md.svelte';
  import MetaBlockFocus from './examples/meta-block-focus.md.svelte';
  import GroupFiles from './examples/group-files.md.svelte';
  import GroupTabs from './examples/group-tabs.md.svelte';
</script>

## Code Block

```markdown
/// src=./examples/single.md.svelte
```

...renders:

<Single />

### One-liner

```markdown
/// src=./examples/single-one-liner.md.svelte
```

...renders:

<SingleOneLiner />

### With Filename Header

```markdown
/// src=./examples/single-with-filename.md.svelte
```

...renders:

<SingleWithFilename />

### With Source Code from Another File

```markdown
/// src=./examples/from-file.md.svelte
```

...renders:

<FromFile />

## Meta Block

### Diff

```markdown
/// src=./examples/meta-block-diff.md.svelte
/// skipMetaBlock=true
```

...renders:

<MetaBlockDiff />

### Highlight

```markdown
/// src=./examples/meta-block-highlight.md.svelte
/// skipMetaBlock=true
```

...renders

<MetaBlockHighlight />

### Focus

```markdown
/// src=./examples/meta-block-focus.md.svelte
/// skipMetaBlock=true
```

...renders

<MetaBlockFocus />

## Group of Code Blocks

### "Files" Display Mode

```markdown
/// src=./examples/group-files.md.svelte
```

...renders:

<GroupFiles />

### "Tabs" Display Mode

```markdown
/// src=./examples/group-tabs.md.svelte
```

...renders:

<GroupTabs />
