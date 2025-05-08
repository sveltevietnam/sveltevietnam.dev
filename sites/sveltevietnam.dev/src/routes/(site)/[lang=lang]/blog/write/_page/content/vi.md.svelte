<script>
  import SectionSop from './sop/vi.md.svelte';
  import SectionSyntax from './syntax/vi.md.svelte';
  import SectionDataEdit from './data-edit/vi.md.svelte';
</script>

## Sơ lược thiết kế kỹ thuật

Blog của Svelte Việt Nam là một trang web tĩnh: dữ liệu của Blog là một phần của mã nguồn và nội dung của bài viết được soạn bằng cú pháp Markdown và Svelte. Quá trình viết bài tương đương với một tác vụ lập trình thông thường chứ không thông qua cơ sở dữ liệu hoặc trình soạn thảo đặc biệt nào ([WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG), trình soạn thảo Markdown, rich text, …). Ở một góc nhìn khác, Blog của Svelte Việt Nam sử dụng Git làm [CMS](https://en.wikipedia.org/wiki/Content_management_system).

Thiết kế này đòi hỏi *người trực tiếp viết bài* cần có một số kiến thức lập trình web cơ bản, nhưng đồng thời cũng giúp tiết kiệm đáng kể tài nguyên bảo trì hạ tầng của trang Blog.

## Với người viết không phải là lập trình viên

Nếu bạn muốn đóng góp nội dung cho Blog nhưng không thể tiếp cận các khía cạnh kỹ thuật được liệt kê tại đây, bạn có thể liên hệ ban quản trị tại [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev) hoặc gởi bài viết bằng các định dạng văn bản truyền thống đến email blog@sveltevietnam.dev.

<h2 id="cau-truc-ma-nguon-bai-viet">Cấu trúc mã nguồn bài viết</h2>

Mỗi bài viết là tập hợp một số tệp tin tại thư mục `sites/sveltevietnam.dev/src/data/blog/posts/:id`:

```raw
  sites/sveltevietnam.dev/src/data/blog/posts/:id
    │
    ├── metadata.ts       <-- dữ liệu bài viết
    │
    ├── content/
    ┆   │
    ┆   ├── en.md.svelte  <-- nội dung bài viết bằng Tiếng Anh
    ┆   └── vi.md.svelte  <-- nội dung bài viết bằng Tiếng Việt
    │
    ├── images/
    ┆   │
    ┆   └── thumbnail.jpg <-- ảnh bìa bài viết
    ┆
```

<SectionSop />
<SectionSyntax />
<SectionDataEdit />

