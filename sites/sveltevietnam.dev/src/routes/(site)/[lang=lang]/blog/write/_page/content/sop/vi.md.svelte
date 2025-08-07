<h2 id="quy-trinh-viet-bai">Sơ lược quy trình viết bài</h2>

### Bước 1: cài đặt các phần mềm cần thiết:

1. [node.js](https://nodejs.org):
    - Phiên bản node.js cần thiết cho dự án được định nghĩa trong tệp
      [package.json](https://github.com/sveltevietnam/sveltevietnam.dev/blob/v1/package.json) tại khóa "engines",
    - Dự án khuyến khích bạn sử dụng [volta](https://volta.sh/) để quản lý phiên bản node.js.
      Nếu đã được cài đặt, volta sẽ tự động thiết lập phiên bản phù hợp cho dự án thông qua định nghĩa trong `package.json`.
2. [lefthook](https://lefthook.dev/installation): trình quản lý [git hook](https://git-scm.com/docs/githooks),
  tự động chạy các tác vụ kiểm định trước khi commit mã nguồn.
  Dự án khuyến khích bạn cài đặt `lefthook` binary vào hệ điều hành thay vì thông qua `npm`.
3. [pnpm](https://pnpm.io/installation): trình quản lý package thay thế cho `npm`.

Và đương nhiên bạn cần cài đặt [git](https://git-scm.com/) và một trình trình soạn thảo mã nguồn (code editor) tùy thích.

### Bước 2: thiết lập môi trường phát triển

1. Sao chép mã nguồn:

    <enhanced-code-block group display="tabs">

    ```bash title="HTTPS"
    git clone https://github.com/sveltevietnam/sveltevietnam.dev.git
    ```

    ```bash title="SSH"
    git clone git@github.com:sveltevietnam/sveltevietnam.dev.git
    ```

    ```bash title="GitHub CLI"
    gh repo clone sveltevietnam/sveltevietnam.dev
    ```

    </enhanced-code-block>

1. Nếu bạn sử dụng `volta` như khuyến nghị ở trên, bạn có thể cài đặt `pnpm` bây giờ
   bằng bộ công cụ của volta. Chạy lệnh sau tại thư mục gốc của dự án:

    ```bash
    volta install pnpm
    ```

3. Chạy lệnh cài đặt môi trường phát triển tại thư mục gốc của dự án:

    ```bash
    pnpm boot
    ```

4. Khởi động development server tại thư mục `sites/sveltevietnam.dev`:

    ```bash title="development"
    cd sites/sveltevietnam.dev
    pnpm dev
    ```

Nếu các bước thiết lập đã thành công, bạn có thể truy cập trang Blog tại http://localhost:5005/vi/blog.

<div class="c-callout c-callout--info">

Bạn có thể tham khảo thêm các hướng dẫn khác dành cho lập trình viên trong tài liệu [DEVELOPMENT.md](https://github.com/sveltevietnam/sveltevietnam.dev/blob/v1/docs/DEVELOPMENT.md)

</div>

### Bước 3: khởi tạo dữ liệu bài viết

Truy cập bằng terminal vào thư mục `sites/sveltevietnam.dev`.
Nếu đây là lần đầu bạn đóng góp nội dung cho trang sveltevietnam.dev, khởi tạo *dữ liệu tác giả* bằng lệnh sau:

```bash
pnpm create:person
```

Sau đó, khởi tạo *dữ liệu bài viết* bằng lệnh:

```bash
pnpm create:post
```

### Bước 4: hoàn thiện bài viết

<div class="c-callout c-callout--info">

Nếu bạn dùng VSCode, hãy mở dự án tại thư mục gốc thay vì `sites/sveltevietnam.dev`,
để VSCode có thể đọc được một số tùy chỉnh trong thư mục `.vscode`.

</div>

Theo sau bước 3, bạn cần hoàn thiện nội dung bài viết tại hai tệp vừa được tạo ra:

- `.../content/vi.md.svelte`: nội dung bài viết bằng tiếng Việt,
- `.../content/en.md.svelte`: nội dung bài viết bằng tiếng Anh.

Bạn có thể tham khảo thêm một số ví dụ và cú pháp đặc biệt tại mục ["Cú pháp Markdown + Svelte trong bài viết"](#cu-phap),
và cách chỉnh sửa dữ liệu bài viết tại mục ["Chỉnh sửa và bổ sung dữ liệu cho bài viết"](#chinh-sua-du-lieu-bai-viet).

<div class="c-callout c-callout--info c-callout--icon-question">

Nếu bạn chỉ có thể viết bài bằng một ngôn ngữ, hãy bỏ trống tệp tin còn lại. Ban quản trị
và các thành viên cộng đồng có thể hỗ trợ bạn dịch bài.

</div>

### Bước 5: tạo pull request

Sau khi hoàn tất nội dung bài viết, bạn cần thực hiện các thao tác quản lý mã nguồn thông thường với `git` và Github
như commit các thay đổi trên một nhánh mới, và tạo [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
đến nhánh mặc định của dự án (nhánh hiển thị tại [sveltevietnam/sveltevietnam.dev repository](https://github.com/sveltevietnam/sveltevietnam.dev)).

Bạn có thể sử dụng [Github CLI](https://cli.github.com/) để giản lược một vài thao tác.
Ví dụ, sau khi [cài đặt Github CLI](https://github.com/cli/cli#installation) và login (`gh auth`), bạn có thể tạo pull request dễ dàng hơn bằng lệnh:

```bash
gh pr create
```

<div class="c-callout c-callout--info">

Thao khảo thêm cách viết commit message tại [DEVELOPMENT.md - Commit Message Guidelines](https://github.com/sveltevietnam/sveltevietnam.dev/blob/v1/docs/DEVELOPMENT.md#commit-message-guidelines).
Quá trình thao tác với `git` và `Github` không khó nhưng bao gồm nhiều bước và có nhiều cách
thực hiện khác nhau nên không được liệt kê chi tiết tại đây. Nếu có thắc mắc hoặc cần hỗ trợ,
hãy liên hệ với ban quản trị qua kênh [Discord - Thảo luận - Blog](https://discord.com/channels/1066621936546877450/1164871648265125918) nhé.

</div>

### Bước 6: kiểm duyệt và xuất bản

Sau khi pull request đã được tạo, ban quản trị sẽ kiểm duyệt nội dung và dữ liệu bài viết.
Nếu cần thay đổi hoặc bổ sung nội dung, ban quản trị sẽ thảo luận cùng bạn ngay tại trang pull request
trên Github.

Khi quy trình kiểm duyệt hoàn tất, ban quản trị sẽ thực hiện thao tác merge pull request và xuất bản
bài viết lên trang Blog 🎉.

