<script>
  import SectionCodeBlock from './code-block/vi.md.svelte';
  import SectionCallout from './callout/vi.md.svelte';
  import SectionImage from './image/vi.md.svelte';
</script>

<h2 id="cu-phap">Cú pháp Markdown + Svelte trong bài viết</h2>

Nội dung của bài viết được xử lý bằng một [Svelte preprocessor](https://svelte.dev/docs/svelte/svelte-compiler#preprocess) chuyên biệt.
Bạn có thể tham khảo [mã nguồn của preprocessor này](https://github.com/sveltevietnam/sveltevietnam.dev/tree/v1/packages/markdown) để
hiểu thêm cách hoạt động của nó. Về cơ bản:

- phần lớn nội dung được viết bằng cú pháp [Github Flavored Markdown](https://github.github.com/gfm/),
- bạn cũng có thể sử dụng cú pháp Svelte, ví dụ như thẻ `script`, `enhanced:img`, hay các component khác,
- syntax highlight cho các ô hiển thị mã nguồn (code block) được xử lý bằng [Shiki](https://shiki.matsu.io/).

Một số cú pháp đặc biệt được phát triển để giúp việc viết bài trở nên dễ dàng hơn. Các cú pháp này được giới thiệu sau đây.

<div class="c-callout c-callout--info c-callout--icon-bulb">

Cách dễ nhất để tiếp cận các cú pháp đặc biệt này là tham khảo mã nguồn của các bài viết đã xuất bản
tại [trang Blog của Svelte Việt Nam](/vi/blog).

Một số cú pháp Markdown hoặc Svelte có thể sẽ không hoạt động như mong đợi.
Trong trường hợp này, hãy liên hệ với ban quản trị để tìm giải pháp thay thế.

</div>

<SectionCodeBlock />
<SectionImage />
<SectionCallout />

