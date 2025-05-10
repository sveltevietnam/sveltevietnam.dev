<script>
  import CodeBlockBasic from './examples/codeblock-basic.md.svelte';
  import CodeBlockDiff from './examples/codeblock-diff.md.svelte';
  import CodeBlockHighlightFocus from './examples/codeblock-highlight-focus.md.svelte';
  import CodeBlockGroupTabs from './examples/codeblock-group-tabs.md.svelte';
  import CodeBlockGroupFiles from './examples/codeblock-group-files.md.svelte';
</script>

### Code Block

For technical blog posts, sharing code snippets is expected.
To display a code block, you can use the following syntax:

```md title=".../en.md.svelte" src="./examples/codeblock-basic.md.svelte"
```

The above content will be displayed as:

<CodeBlockBasic />

#### Indicating Code Changes (diff)

To indicate code changes, you can wrap the code block with comments using the `:::diff +` or
`:::diff -` directive. For example, the following content...

```md title=".../en.md.svelte" src="./examples/codeblock-diff.md.svelte" skipMetaBlock
```

...will be displayed as:

<CodeBlockDiff />

#### Highlighting and Focusing Code

To set emphasis on one or more lines in the code block, you can wrap the code block with comments using the
`:::highlight` or `:::focus` directive. For example, the following content...

```md title=".../en.md.svelte" src="./examples/codeblock-highlight-focus.md.svelte" skipMetaBlock
```

...will be displayed as:

<CodeBlockHighlightFocus />

#### Grouping Multiple Code Blocks

To display multiple code blocks that share the same context, you can use the `enhanced-code-block`
element with the `group` attribute. For example, the following content...

```md title=".../en.md.svelte" src="./examples/codeblock-group-tabs.md.svelte"
```

...will be displayed as a tab group:

<CodeBlockGroupTabs />


Additionally, to group code blocks as a collection of files, you can set `display="files"`. For
example, the following content...

```md title=".../en.md.svelte" src="./examples/codeblock-group-files.md.svelte"
```

...will be displayed as a file group:

<CodeBlockGroupFiles />

<div class="c-callout c-callout--warning">

Note: The empty lines surrounding the `enhanced-code-block` opening and closing tags and
its content are necessary.

</div>

