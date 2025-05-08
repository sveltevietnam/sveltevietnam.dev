## Chỉnh sửa và bổ sung dữ liệu

Theo ["Sơ lược quy trình viết bài"](#quy-trinh-viet-bai), dữ liệu bài viết và tác giả sẽ được khởi
tạo tự động bằng lệnh `pnpm create:post` và `pnpm create:person`. Tuy nhiên, bạn có thể chỉnh sửa
dữ liệu này khi cần thiết.

<h3 id="chinh-sua-du-lieu-bai-viet">Cho bài viết</h3>

Như đã đề cập tại muc ["Cấu trúc mã nguyền bài viết"](#cau-truc-ma-nguon-bai-viet), dữ liệu chính của mỗi bài viết được đặt
tại têp `sites/sveltevietnam.dev/src/data/blog/posts/:id/metadata.ts`. Ví dụ, dữ liệu của bài viết
["Đến với web thông qua Svelte"](/vi/blog/20240420-den-voi-web-thong-qua-svelte) được định nghĩa như sau:

```ts title="20240420-come-for-svelte-stay-for-the-web" src="../../../../../../../../data/blog/posts/20240420-come-for-svelte-stay-for-the-web/metadata.ts"
```

Khi bạn đã hoàn thành nội dung bài viết, hãy quay trở lại tệp `metadata.ts` tương ứng và cập nhật
các trường dữ liệu cần thiết, ví dụ như `readMinutes` và `numWords`.

#### Ảnh bìa bài viết

Để thay đổi ảnh bìa bài viết, bạn chỉ cần thêm tệp `thumbnail.jpg` vào thư mục `.../images` như
đã liệt kê tại mục ["Cấu trúc mã nguồn bài viết"](#cau-truc-ma-nguon-bai-viet).
Dự án có một số quy định và đề xuất cho ảnh bìa như sau:

- cần ở định dạng JPEG và có tên là `thumbnail.jpg`,
- có chiều rộng tối thiểu là 2240px,
- có tỷ lệ khung hình là 16:9,
- tối giản, và hạn chế văn bản trong ảnh.

<h3 id="chinh-sua-du-lieu-tac-gia">Cho tác giả</h3>

Dữ liệu tác giả được định nghĩa tại tệp
`sites/sveltevietnam.dev/src/data/people/:id/index.ts`.
Ví dụ, dữ liệu của ["Phan Quang"](/vi/con-nguoi/vnphanquang) được định nghĩa như sau:

```ts title="20240420-come-for-svelte-stay-for-the-web" src="../../../../../../../../data/people/vnphanquang/index.ts"
```

