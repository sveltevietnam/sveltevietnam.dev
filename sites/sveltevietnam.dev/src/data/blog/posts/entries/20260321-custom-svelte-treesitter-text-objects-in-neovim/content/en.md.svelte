If you still enjoy crafting code by hand, in 2026, in peace, without some LLM screaming into your eyeballs with
overly-verbose analysis of the entire history of the written earth (probably by stealing creative work of some nonconsenting humans),
and you also happen to be using [Neovim](https://neovim.io/), welcome my friend! This post introduces
some custom treesitter text objects that I have found useful over the last couple of months,
primarily around the template blocks (if/each/key/await/...).

## Feed me Code

Less words, more text objects:

```lisp title="~/.config/nvim/after/queries/svelte/textobjects.scm"
; extends

; Svelte-specific text objects
; based on grammar defined at
; https://github.com/tree-sitter-grammars/tree-sitter-svelte

; For tree-sitter grammar and query documentation, see:
; https://tree-sitter.github.io/tree-sitter/index.html

; directives
(attribute
  (attribute_name) @_name
  (expression)? @svelte.directive.inner
  (#match? @_name "^(bind|use|transition|in|out|animate|style|class):.*$")) @svelte.directive.outer

; if block
(if_statement
  (if_start)
	_* @svelte.if.inner @svelte.block.inner @conditional.inner
  (if_end)
) @svelte.if.outer @svelte.block.outer @conditional.outer

; each block
(each_statement
  (each_start)
	_* @svelte.each.inner @svelte.block.inner @loop.inner
  (each_end)
) @svelte.each.outer @svelte.block.outer @loop.outer

; key block
(key_statement
  (key_start)
	_* @svelte.block.inner @svelte.key.inner
  (key_end)
) @svelte.block.outer @svelte.key.outer

; await block
(await_statement
  (await_start)
	_* @svelte.block.inner @svelte.await.inner
  (await_end)
) @svelte.block.outer @svelte.await.outer

; snippet block
(snippet_statement
  (snippet_start)
	_* @svelte.block.inner @svelte.snippet.inner
  (snippet_end)
) @svelte.block.outer @svelte.snippet.outer
```

## What are Text Objects?

I won't go into the details of what text objects are, but in short, they are structured
selections that enable Vim motion. For example, when you type `diw`, you are telling (Neo)Vim to delete
(`d`) the current/next  inner-word (`iw`) text object. Here are a few resources to help
understand what the hell I'm talking about in this post.

- [Josean Martinez > A Powerful Way To Make Editing Code In Neovim Even Better (Treesitter & Text Objects)](https://www.josean.com/posts/nvim-treesitter-and-textobjects),
- [Neovim Docs > Motion > Text Objects](https://neovim.io/doc/user/motion/#text-objects),
- [Ofir Gall > Learn Neovim > Text Objects](https://ofirgall.github.io/learn-nvim/chapters/05-text-objects.html#text-objects),
- [The nvim-treesitter-textobjects plugin][nvim-treesitter/nvim-treesitter-textobjects],
- [The mini.ai plugin][mini.ai] (ai = a/i textobjects, not freaking AI).

## Using the [nvim-treesitter/nvim-treesitter-textobjects] Plugin

If you have the titular plugin installed you can already use some text objects in Svelte (that [I've PR-ed into
the repo](https://github.com/nvim-treesitter/nvim-treesitter-textobjects/pull/737) - brag, I know,
but all credits should go to the people behind [tree-sitter-svelte](https://github.com/tree-sitter-grammars/tree-sitter-svelte), and `@kiyoon` - the plugin code owner - for refining the definitions).

The exact keybinding to grab those text objects depends on your NeoVim configuration.
For example, using [mini.ai], you can select the entire `each` block with this configuration:

```lua title="your-config.lua"
require("mini.ai").setup({
  custom_textobjects = {
    e = spec_treesitter({
      a = {
        "@loop.outer",
      },
      i = {
        "@loop.inner",
      },
    }),
  },
})
```

If this workflow suits you well already, the rest of the post is probably redundant.

## Svelte-specific Text Objects

The text objects covered by [nvim-treesitter/nvim-treesitter-textobjects] are generic, e.g. `@block`, `@conditional`, `@loop`, etc. And because Svelte uses the Single-File-Component format (markup, styling, logic in same file), `@loop.inner`, for example, may select a Javascript `for` block statement instead of an `#each` block.

Thus, to target exactly Svelte specific text objects I prefer to add some override as shown in the [Feed me
Code](#feed-me-code) section (notice the additional `@svelte...` naming). Coupled with this `mini.ai` configuration...

```lua title="my-config.lua"
require("mini.ai").setup({
  custom_textobjects = {
    d = spec_treesitter({
      a = {
        "@svelte.directive.outer",
      },
      i = {
        "@svelte.directive.inner",
      },
    }),
    j = spec_treesitter({
      a = {
        "@block.outer",
      },
      i = {
        "@block.inner",
      },
    }),
  },
})
```

... I can now simply use `d` to target Svelte directives (e.g. `use:action`, `bind:value`) or `j` for any
block, i.e `#if`, `#each`, `#key`, `#await`, and `#snippet`. This helped significantly in
instances where I needed to made up some macro on on the go in refactoring sessions.

<div class="c-callout c-callout--info c-callout--icon-bulb">

If it isn't obvious, the code snippet in [Feed me Code](#feed-me-code) simply lives at `~/.config/nvim/after/queries/svelte/textobjects.scm`.

</div>

I think this extension can also be added to the [nvim-treesitter/nvim-treesitter-textobjects] repo,
but I don't really know if the code owner is okay with having some Svelte specific
naming for the text objects. If you are interested, please consider opening a PR/issue there.

## Bonus: Trying/Debugging Text Objects Interactively

Run the `:InspectTree` command to trigger the syntax tree parsed by treesitter for the current buffer. Run
`:EditQuery` to trigger the live query editor; here you can parse the entire code in [Feed me
Code](#feed-me-code) and see how the text objects are being selected in real time.

## Closing

I hope this has been helpful. Suggestions for improvement are always welcome. You can find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com) or via the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

Thanks for reading, and happy vim-ing!

[nvim-treesitter/nvim-treesitter-textobjects]: https://github.com/nvim-treesitter/nvim-treesitter-textobjects
[mini.ai]: https://github.com/nvim-mini/mini.ai
