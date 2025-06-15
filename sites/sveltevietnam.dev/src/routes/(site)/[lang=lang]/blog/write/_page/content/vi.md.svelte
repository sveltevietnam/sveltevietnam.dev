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
    ┆   └── ...           <-- các hình ảnh khác được sử dụng trong bài viết
    ┆
    ├── ...               <-- các dữ liệu khác của bài viết
```

<SectionSop />
<SectionSyntax />
<SectionDataEdit />

## Thêm bình luận cho bài viết

Hiện tại, mỗi bài viết có thể được liên kết với một bài đăng trên [Bluesky](https://bsky.app).
Khi được liên kết, bình luận từ Bluesky sẽ được hiển thị dưới bài viết. Để tạo liên kết này, bạn có thể:

1. chủ động đăng bài viết đã xuất bản trên Bluesky qua tài khoản cá nhân của mình, và gởi bài đăng Bluesky đến ban quản trị, hoặc
2. yêu cầu ban quản trị tạo bài đăng Bluesky cho bài viết của bạn, qua [tài khoản Svelte Việt Nam](https://bsky.app/profile/sveltevietnam.dev).

Phương án (1) nhằm tạo điều kiện trong trường hợp bạn muốn xây dựng tài khoản Bluesky cá nhân. Sau
khi liên kết được thực hiện thành công, tài khoản Bluesky Svelte Việt Nam sẽ *đăng lại (repost)* bài của bạn.

## Về việc sử dụng AI

Ban quản trị không ngăn cấm việc sử dụng
[Generative AI](https://vi.wikipedia.org/wiki/Tr%C3%AD_tu%E1%BB%87_nh%C3%A2n_t%E1%BA%A1o_t%E1%BA%A1o_sinh)
(trí tuệ nhân tạo tạo sinh) để hỗ trợ viết bài. AI có thể hữu ích cho các công việc như:

- hỗ trợ quá trình dịch bài viết sang các ngôn ngữ khác,
- hỗ trợ tạo *văn bản thay thế* cho các nội dung trực quan như hình ảnh, biểu đồ, v.v,
- hỗ trợ kiểm tra ngữ pháp, chính tả, và cú pháp.

Tuy nhiên, ban quản trị khuyến khích bạn đề cao tính chân thật, sáng tạo, và dấu ấn cá nhân trong nội dung của mình.
Để bảo đảm các tiêu chí này, nếu bạn sử dụng AI để trực tiếp tạo ra nội dung thay vì chỉ hỗ trợ cho những tác vụ như trên, bạn cần:

1. thêm cấu hình sau vào [dữ liệu bài viết](#chinh-sua-du-lieu-bai-viet):

```ts title=".../metadata.ts"
export default defineBlogPostMetadata({
  ai: true,
  // ...
});
```

2. đề cập rõ trong bài viết về mục đích sử dụng AI và các nội dung được tạo ra bởi AI.

## Phản hồi và đóng góp

Nếu có góp ý cho quy trình viết bài, bạn có thể
[tạo issue tại Github](https://github.com/sveltevietnam/sveltevietnam.dev/issues),
hoặc liên hệ ban quản trị tại [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev)
hoặc qua email blog@sveltevietnam.dev.

Xin cảm ơn!
