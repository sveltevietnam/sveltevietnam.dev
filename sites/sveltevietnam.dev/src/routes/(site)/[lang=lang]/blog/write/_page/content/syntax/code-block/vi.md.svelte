<script>
  import CodeBlockBasic from './examples/codeblock-basic.md.svelte';
  import CodeBlockDiff from './examples/codeblock-diff.md.svelte';
  import CodeBlockHighlightFocus from './examples/codeblock-highlight-focus.md.svelte';
  import CodeBlockGroupTabs from './examples/codeblock-group-tabs.md.svelte';
  import CodeBlockGroupFiles from './examples/codeblock-group-files.md.svelte';
</script>

### Code Block

Để hiển thị một đoạn mã nguồn trong bài viết, bạn có thể sử dụng cú pháp theo ví dụ sau:

```md title=".../vi.md.svelte" src="./examples/codeblock-basic.md.svelte"
```

Nội dung trên sẽ hiển thị như sau:

<CodeBlockBasic />

#### Hiển thị thay đổi mã nguồn (diff)

Để chỉ rõ các thay đổi trong một mã nguồn, bạn có thể bọc đoạn mã xung quanh comment với chỉ thị `:::diff +` hoặc `:::diff -`. Ví dụ, nội dung sau...

```md title=".../vi.md.svelte" src="./examples/codeblock-diff.md.svelte" skipMetaBlock
```

...sẽ hiển thị:

<CodeBlockDiff />

#### Đánh dấu mã nguồn (highlight & focus)

Để nhấn mạnh một hay nhiều dòng trong đoạn mã, bạn có thể sử bọc đoạn mã xung quanh comment với chỉ
thị `:::highlight` hoặc `:::focus`. Ví dụ, nội dung sau...

```md title=".../vi.md.svelte" src="./examples/codeblock-highlight-focus.md.svelte" skipMetaBlock
```

...sẽ hiển thị:

<CodeBlockHighlightFocus />

#### Nhóm mã nguồn (group)

Để hiển thị nhiều mã nguồn thuộc cùng một ngữ cảnh, bạn có thể sử dụng thẻ `enhanced-code-block`
và thuộc tính `group`. Ví dụ, nội dung sau...

```md title=".../vi.md.svelte" src="./examples/codeblock-group-tabs.md.svelte"
```

...sẽ hiển thị nhóm dưới dạng tab:

<CodeBlockGroupTabs />

Ngoài ra, để nhóm các mã nguồn như tập hợp các tệp tin, bạn có thể sử dụng `display="files"`. Ví dụ,
nội dung sau...

```md title=".../vi.md.svelte" src="./examples/codeblock-group-files.md.svelte"
```

...sẽ hiển thị:

<CodeBlockGroupFiles />

<div class="c-callout c-callout--warning">

Chú ý: các dòng trống xung quanh thẻ `enhanced-code-block` và các nội dung bên trong là cần thiết.

</div>

#### Tải mã nguồn từ tệp ngoài

Bạn có thể sử dụng thuộc tính `src` để tải nội dụng từ một tệp riêng theo ví dụ sau:

```md title=".../en.md.svelte" src="./examples/codeblock-external-src.vi.md.svelte"
```

Tệp `path/to/source.ext` sử dụng một trong các ngôn ngữ được hỗ trợ
(xem [mã nguồn](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/packages/markdown/src/shiki.js)).
Hình thức này giúp bạn khỏi phải sao chép mã nguồn có sẵn vào bài viết, đồng thời có thể
tận dụng các tính năng của trình soạn thảo như language server, linter, formater, v.v.
