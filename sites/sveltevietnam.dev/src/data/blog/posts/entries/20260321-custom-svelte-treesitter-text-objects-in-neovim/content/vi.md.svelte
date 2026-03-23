Bài viết này giới thiệu nhanh một số text object hỗ trợ làm việc với Svelte trong [Neovim](https://neovim.io/), chủ yếu xoay quanh các đoạn template (`if`/`each`/`key`/`await`/...).

## Cho tui code

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

## Text Object là gì?

Mình sẽ không đi sâu vào chi tiết, nhưng nói ngắn gọn: text object là các nhóm văn bản có cấu trúc
mà ta có thể thao tác khi dùng (Neo)Vim. Ví dụ, khi bạn gõ `diw`, bạn đang bảo trình soạn thảo xóa (`d`) text object mang tên inner-word (`iw`) tại vị trí hiện tại / tiếp theo. Dưới đây là một số tài liệu tham khảo thêm:

- [Josean Martinez > A Powerful Way To Make Editing Code In Neovim Even Better (Treesitter & Text Objects)](https://www.josean.com/posts/nvim-treesitter-and-textobjects),
- [Neovim Docs > Motion > Text Objects](https://neovim.io/doc/user/motion/#text-objects),
- [Ofir Gall > Learn Neovim > Text Objects](https://ofirgall.github.io/learn-nvim/chapters/05-text-objects.html#text-objects),
- [Plugin nvim-treesitter/nvim-treesitter-textobjects][nvim-treesitter/nvim-treesitter-textobjects],
- [Plugin mini.ai][mini.ai] (ai = a/i textobjects, không phải AI nhé).

## Dùng plugin [nvim-treesitter/nvim-treesitter-textobjects]

Nếu bạn đã cài plugin trên, một số text object trong Svelte đã có sẵn. Cần nhấn cụ thể nút nào để sử dụng các text object này là phụ thuộc vào cấu hình NeoVim của bạn. Ví dụ, với [mini.ai], bạn có thể chọn toàn bộ block `each` bằng cấu hình sau:

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

## Text Object đặc thù cho Svelte

Các text object trong [nvim-treesitter/nvim-treesitter-textobjects] mang tên chung, trùng với các text object tương tự trong các ngôn ngữ / cú pháp khác. Ví dụ: `@block`, `@conditional`, `@loop`, v.v. Vì Svelte dùng định dạng Single-File-Component (markup, styling, logic trong cùng một file), sử dụng các test object chung chung này có thể không mang lại kết quả chính xác lắm. Ví như khi ta dùng text object `@loop.inner`, trình soạn thảo có thể sẽ hiểu nhầm ta muốn tìm một đoạn `for` trong JavaScript thay vì block `#each` trong Svelte.

Vì vậy, để nhắm đúng các text object đặc thù của Svelte, mình thường ghi đè cấu hình bằng đoạn mã như đã trình bày ở phần [Cho tui code](#cho-tui-code) (chú ý cách đặt tên bổ sung với tiền tố `@svelte...`). Kết hợp với cấu hình `mini.ai` dưới đây...

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

... mình có thể dùng `d` để nhắm vào các Svelte directive (ví dụ: `use:action`, `bind:value`) hoặc `j` cho bất kỳ block nào: `#if`, `#each`, `#key`, `#await` và `#snippet`. Việc này tương đối kỳ hữu ích khi cần tạo macro nhanh trong các buổi phải ngồi refactor.

<div class="c-callout c-callout--info c-callout--icon-bulb">

Đoạn code trong phần [Cho tui code](#cho-tui-code) đặt tại `~/.config/nvim/after/queries/svelte/textobjects.scm`.

</div>

Mình nghĩ phần mở rộng này cũng có thể được đóng góp vào repo [nvim-treesitter/nvim-treesitter-textobjects], nhưng không chắc code owner có muốn thêm cách đặt tên riêng cho Svelte hay không. Nếu bạn quan tâm, hãy cân nhắc mở một PR/issue nhé.

## Mở rộng: thử và debug text object trực tiếp

Chạy lệnh `:InspectTree` để hiển thị cây cú pháp được treesitter phân tích cho buffer hiện tại. Chạy `:EditQuery` để mở live query editor — tại đây bạn có thể dán toàn bộ code trong phần [Cho tui code](#cho-tui-code) và xem các text object được chọn trong thời gian thực.

## Kết

Hoan nghênh phê bình và ý tưởng cải thiện của bạn, và mong bài viết có ích. Bạn có thể thảo luận thêm với mình tại [vnphanquang trên Bluesky](https://bsky.app/profile/vnphanquang.com) hoặc qua [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Cảm ơn bạn đã đọc bài!

[nvim-treesitter/nvim-treesitter-textobjects]: https://github.com/nvim-treesitter/nvim-treesitter-textobjects
[mini.ai]: https://github.com/nvim-mini/mini.ai
