<script>
  import Playground from './code/playground.svelte';
  import Configuration from './code/configuration.svelte';
</script>

Trên tinh thần tận dụng triệt để tính "reactivity" của Svelte 5 như đã đề cập ở bài viết ["Giúp WXT Extension Storage trở nên "reactive" bằng Svelte's createSubscriber"](/vi/blog/20250425-mini-snippet-reactive-extension-storage-wxt), mình xin chia sẻ một giải pháp đóng gói [WebStorage] (`localStorage` và `sessionStorage`) để có trải nghiệm lập trình tốt hơn trong các dự án Svelte.

## Cho tui code!

Sao chép tệp này vào dự án của bạn...

```ts title="lib.ts" src="./code/lib.ts"
```

và sử dụng như ví dụ sau:

```ts title="storage.ts" src="./code/storage.ts"
```

`storage.num`, `storage.sr`, ... có thể sử dụng trong markup và tự động cập nhật khi giá trị thay đổi.

## Giải pháp khác

Bạn có thể tham khảo [thảo luận tại Reddit](https://www.reddit.com/r/sveltejs/comments/1d43d8p/svelte_5_runes_with_localstorage_thanks_to_joy_of/) với một [giải pháp đề xuất từ Joy of Code](https://www.youtube.com/watch?v=HnNgkwHZIII),
hoặc xem qua [đoạn mã thử nghiệm của Rich Harris](https://github.com/Rich-Harris/local-storage-test/blob/91472fa04e135a64316db42aae69bec4d6944ca7/src/lib/storage.svelte.ts).

Về cơ bản, những hướng giải quyết này đều có ích nhưng chưa hoàn toàn thỏa mãn yêu cầu của mình.

## Vấn đề

Giải pháp giới thiệu trong bài viết này được thiết kế để giải quyết một số vấn đề sau đây:

1. Cung cấp tính "reactivity" thông qua một lớp trừu tượng đơn giản nhất có thể, cho các phần tử lưu trữ bằng [WebStorage],
2. Tự động hóa `JSON.stringify` và `JSON.parse` khi lưu trữ và lấy dữ liệu từ [WebStorage], vì `localStorage` và `sessionStorage` hiện tại chỉ hỗ trợ lưu trữ dưới dạng chuỗi (string),
3. Có thể khởi tạo với giá trị mặc định ngay từ phía server.

## Thử nghiệm

Bạn có thể thử nghiệm giải pháp của mình ngay sau đây
(hoặc qua [Svelte REPL này](https://svelte.dev/playground/6379413bef66424ca744245d9174c2d2?version=5.33.14)).
Trước tiên, đây là cấu hình mong muốn của đối tượng `storage`:

<Configuration />

Đoạn mã cần thiết để tạo ra `storage` được liệt kê tại ô `storage.ts` ở phần ["Cho tui code!"](#cho-tui-code). Tiếp theo, hãy dùng chương trình dưới đây và thử thay đổi giá trị của các phần tử:

<Playground />

<div class="c-callout c-callout--success c-callout--icon-bulb">

Bạn có thể thử mở 2 tab / cửa sổ khác nhau và quan sát giá trị được đồng bộ hóa giữa các tab đó
(đối với các phần tử được lưu trữ trong `localStorage`).

</div>

Mở rộng ô sau đây nếu bạn muốn xem chi tiết mã nguồn của chương trình trên:

```svelte title="playground.svelte" src="./code/playground.svelte" collapsed
```

## Thiết kế API

Khó có thể nói đâu là điểm cân bằng giữa việc thiết kế một API vừa có kiến trúc đơn giản và hiệu quả,
lại vừa cung cấp trải nghiệm người dùng API một cách tự nhiên và thân thiện nhất.
Trong trường hợp này, một trong những yêu cầu mình đặt ra là `storage` được tạo ra cần giống như một
đối tượng thông thường, có thể tham chiếu trực tiếp (vd. `storage.field`), chứ ko phải thông qua một lớp
trung gian nào đó (vd. `storage.field.current`):

```svelte
<input type="text" bind:value={storage.str}>
```

Tiếp theo, mình muốn có thể khởi tạo một đối tượng `storage` chứa nhiều phần tử dữ liệu khác nhau,
thay vì một đối tượng cho mỗi phần tử:

```ts title="tập trung hóa"
// :::diff -
const str = new ReactiveStorageItem('str');
const bool = new ReactiveStorageItem('bool');
// :::
// :::diff +
const storage = new ReactiveStorage(['str', 'bool']);
storage.str; storage.bool;
// :::
```

Bên cạnh đó, mình muốn tận dụng tối đa hỗ trợ từ Typescript cho type checking, nhưng không
quá phụ thuộc vào Typescript generics và các kiểu phân thích tự động (inference):

```ts title="khai báo type chủ động"
type StorageValue = {
  str: string | null;
  num: number | null;
  /* ... */
};
// :::highlight
const storage = new ReactiveStorage<StorageValue>({ /* ... */ })
// :::
storage.str; // <-- string
stroage.num; // <-- number
```

## Có nên tạo thành thư viện?

Mình có xu hướng hay đóng gói các giải pháp như thế này để tái sử dụng dễ dàng hơn —
Tương tự như các thư viện tại tập hợp [@svelte-put](https://svelte-put.vnphanquang.com).
Tuy nhiên, mình chưa sử dụng giải pháp "reactive-storage" này đủ nhiều để có thể đánh giá mức độ
thực tế và tính ổn định của nó.

Có khá nhiều vấn đề cần nghĩ tới khi muốn đóng gói một giải pháp, ví dụ như:

- xử lý lỗi tại runtime, ví dụ như nếu `JSON.parse` không thành công trong quá trình tham chiếu dữ
liệu,
- cung cấp giải pháp lắng nghe thay đổi, ví dụ thông qua
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent),
- kiểm thử mã nguồn,

Nếu bạn nghĩ giải pháp này là hữu ích và nên được đóng gói thành thư viện, hãy cho mình biết nhé!

## Kết

Để tránh dài dòng, mình không giải thích chi tiết về mã nguồn trong bài viết này. Nếu bạn muốn thảo
luận thêm, hãy tìm mình tại [vnphanquang trên Bluesky](https://bsky.app/profile/vnphanquang.com)
hoặc qua [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Hy vọng giải pháp được giới thiệu ở đây có ích cho bạn. Cảm ơn bạn đã đọc bài!

[createSubscriber]: https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber
[WebStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
