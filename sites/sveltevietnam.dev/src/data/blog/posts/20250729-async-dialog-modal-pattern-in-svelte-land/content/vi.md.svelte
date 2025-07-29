<script>
  import Layout from '../example/layout.svelte';
  import Usage from '../example/usage.svelte';
</script>

Mình luôn cố gắng tránh sử dụng hộp thoại trong các dự án web do tính phức tạp, khó chia sẻ đường dẫn,
và đặc biệt khó bảo đảm các yêu cầu trợ năng (accessibility). Ví dụ, một hộp thoại chứa biểu mẫu tạo mới
một dữ liệu nào đấy (v.d. tạo mới người dùng) thường có thể được thay thế bằng một trang riêng biệt.

Tuy vậy, có những trường hợp hộp thoại vẫn là giải pháp thích hợp cho trải nghiệm người dùng,
như *hộp thoại xác nhận* trước khi thực hiện một thao tác quan trọng. Bài viết này lấy ví dụ
vừa nói để giới thiệu một cách thiết lập và sử dụng hộp thoại trong Svelte.

## Thử nghiệm thực tế

Dưới đây là ví dụ đã hiện thực hóa. Mã nguồn của ví dụ được ghi tại phần "[Cho tui code](#cho-tui-code)".

<fieldset class="not-prose border border-outline p-4">
<legend>Ví dụ</legend>
<Layout />
<Usage
  buttonMessage="Kích hoạt hộp thoại"
  messageOnConfirm="Đã xác nhận"
  messageOnCancel="Đã hủy"
  title="Bạn có muốn tiếp tục không?"
  desc="Một số thông tin hoặc lưu ý về hành động sắp thực hiện..."
  cancel="Hủy"
  confirm="Xác nhận"
/>
<p class="mt-4 c-text-body-sm">Ghi chú: cần Javascript để hoạt động</p>
</fieldset>

## "Hộp thoại async"

Thuật ngữ "hộp thoại async" mình sử dụng trong bài viết này để chỉ việc hộp thoại được kích hoạt
thông qua Javascript và kết quả của nó có thể được `await` một cách liền mạch, ví dụ...

```ts title="Hộp thoại async"
import ConfirmationDialog from './ConfirmationDialog.svelte';

function doSomething() {
  const confirmed = await triggerAndWaitFor(ConfirmationDialog);
  if (confirmed) // tiếp tục với thao tác đã xác nhận
}
```

...thay vì kết hợp nhiều luồng khác nhau (giải pháp phổ biến), ví dụ một luồng để kích hoạt, và một luồng khác để nhận
kết quả:

```svelte title="Hộp thoại không async"
<script lang="ts">
  import ConfirmationDialog from './ConfirmationDialog.svelte';

  let dialog: typeof ConfirmationDialog;

  function doSomething() {
    // (1) Kích hoạt hộp thoại
    dialog.open();
  }

  function handleDialogOutput(confirmed: boolean) {
    // (2) Nhận kết quả từ hộp thoại
    confirmed = true;
  }
</script>

<ConfirmationDialog bind:this={dialog} onoutput={handleDialogOutput} />
```

## Cho tui code!

<div class="c-callout c-callout--info c-callout--icon-bulb">

Khuyến khích bạn sử dụng máy tính thay vì điện thoại để xem mã nguồn rõ hơn nhé!

</div>

Thiết lập:

<enhanced-code-block group display="files">

```svelte title="+layout.svelte" src="../example/layout.svelte"
```

```ts title="dialog.ts" src="../example/dialog.ts"
```

```css title="c-dialog.css" src="../../../../../../../../packages/css/src/components/c-dialog.css"
```

</enhanced-code-block>

Ví dụ sử dụng (như đã thấy tại "[Thử nghiệm thực tế](#thu-nghiem-thuc-te)"):

<enhanced-code-block group display="files">

```svelte title="usage.svelte" src="../example/usage.svelte"
```

```svelte title="confirmation-dialog.svelte" src="../example/confirmation-dialog.svelte"
```

</enhanced-code-block>

## Sơ lược

Giống như các bài viết khác trong chuỗi [Mini Snippet](/vi/blog/chuoi-bai-viet/mini-snippet), mình
sẽ không giải thích chi tiết về mã nguồn trên mà chỉ bàn về một số điểm đáng chú ý sau đây.

### `@svelte-put/async-stack`

Giải pháp đã nêu sử dụng thư viện
[@svelte-put/async-stack](https://svelte-put.vnphanquang.com/docs/async-stack) do mình viết ra.
Thư viện này được thiết kế **chỉ để xử lý logic** (headless - không quan tâm đến giao diện) cho nhu cầu
hiển thị component vào một khu vực trung tâm. Nó cũng có thể được tái sử dụng cho một hệ thống
thông báo (notification / toast).

```ts title="async-stack"
import { stack } from '@svelte-put/async-stack';
export const dialogOrNotificationStack = stack().build();
```

### Kích hoạt và hiển thị

Hộp thoại được kích hoạt bằng cách đẩy component vào stack với dữ liệu cần thiết:

```ts title="kích hoạt"
const pushed = dialogStack.push('custom', {
  component: ConfirmationDialog,
  props: confirmDialogProps,
})
```

Component này được hiển thị tại `+layout.svelte` (xem như một portal), và tự động gở bỏ với sự
giúp đỡ của stack với thao tác người dùng tương ứng. Cách này cũng giúp ta dễ dàng tận dụng
[dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
cho component, giúp cho việc tối ưu hóa mã nguồn:

```ts
const component = (await import('./ConfirmationDialog.svelte')).default;
```

### Chờ kết quả

Ngay sau khi kích hoạt hộp thoại, ta có thể truy cập
[một số tính năng của phần tử trên stack](https://svelte-put.vnphanquang.com/docs/async-stack#component),
bao gồm cả việc chờ dữ liệu trả về từ hộp thoại.

```ts
output = await pushed.resolution;
```

Như đã bàn, việc này giúp mình thao tác một cách liền mạch, không phải lắng nghe kết quả thông qua
một luồng dữ liệu khác như callback hay event listener.

### Sử dụng HTML dialog

Giải pháp được thiết kế để hoạt động hiệu quả với [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog),
tận dụng các tính năng sẵn có để đảm bảo trợ năng và giảm thiểu tối đa số lượng mã nguồn cần thiết.

Theo đó, hàm `enhanceDialog` từ tệp `dialog.ts` bổ sung các tính năng:

1. tự động gọi [showModal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal),
2. đóng hộp thoại khi người dùng nhấn vào backdrop (clickoutside),
3. hỗ trợ tự động kết quả trả về nếu tích hợp với `<form method="dialog">` như ví dụ, giúp giảm
   thiểu sự lệ thuộc vào Javascript trong các truờng hợp đơn giản.

## Mở rộng

Để đảm bảo tính đóng gói và dễ kiểm thử, mình có thể sử dụng [Svelte context](https://svelte.dev/docs/svelte/context)
để chứa `dialogStack`.

```ts title="dialog-context.svelte.ts" src="../../../../../lib/dialogs/context.svelte.ts"
```

Giải pháp có thể được mở rộng để hỗ trợ các tính năng khác. Ví dụ, hộp thoại tìm kiểm tại sveltevietnam.dev
sử dụng [@svelte-put/lockscroll](https://svelte-put.vnphanquang.com/docs/lockscroll) để khóa thanh cuộn (scrollbar).
Bạn có thể kích hoạt hộp thoại (<kbd>Ctrl/Cmd</kbd><kbd>K</kbd>, hoặc trên thanh công cụ) và quan sát thanh cuộn.

## Kết

Ngày nay, dù HTML dialog đã được hỗ trợ rộng rãi và tiện nghi hơn các giải pháp trước đây, mình vẫn
thường tìm thấy nhu cầu cao hơn so với dialog thuần. Hiện tại, mình tương đối hài lòng với giáp pháp
nêu trong bài viết này, và đã sử dụng nó trong khá nhiều dự án. Tuy nhiên, như đã bàn tại phần mở
bài, mình vẫn luôn cố gắng hạn chế sử dụng hộp thoại nhiều nhất có thể.

Nếu có góp ý hoặc câu hỏi, bạn có thể tìm mình tại [vnphanquang trên Bluesky](https://bsky.app/profile/vnphanquang.com) hoặc tại [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev). Cảm ơn bạn đã đọc bài!
