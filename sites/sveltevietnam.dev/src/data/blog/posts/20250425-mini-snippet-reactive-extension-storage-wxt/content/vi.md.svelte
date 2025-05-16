Gần đây mình vừa tham gia một dự án cần xây dựng web extension, một cơ hội đúng thời điểm mình
muốn thử nghiệm framework [wxt.dev](https://wxt.dev/) sau nhiều lần lướt qua và nghe nhiều lời khen từ cộng động.
Sau một thời gian ngắn, mình cảm thấy hài lòng về trải nghiệm lập trình với framework này. Tuy nhiên,
mình không có quá nhiều kinh nghiệm đối với cả WXT và web extension nên những chia sẻ trong bài viết này có thể
có khuyết điểm. Nếu phát hiện ra điều gì không hợp lý, hãy hét thẳng vào mặt mình nhé.

Tóm gọn bài viết: mình sử dụng [createSubscriber](https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber)
từ Svelte để đóng gói `@wxt-dev/storage` thành reactive storage.
Bài viết sẽ dễ hiểu hơn nếu bạn đã từng làm việc với `createSubscriber`
và [Web Storage APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API),
cụ thể hơn là [@wxt-dev/storage](https://wxt.dev/storage) cho web extension.

<div class="c-callout c-callout--info">

Ta chỉ có thể dùng `createSubscriber` từ phiên bản [Svelte 5](https://svelte.dev/blog/svelte-5-is-alive).
Xem thêm [hướng dẫn nâng cấp lên Svelte 5](https://svelte.dev/docs/svelte/v5-migration-guide) nếu
bạn vẫn đang dùng phiên bản cũ hơn nhé.

</div>

## Đưa tui code

```typescript title="reactive-storage.ts"
import { createSubscriber } from 'svelte/reactivity';
import { storage } from '#imports'; // assuming @wxt-dev/storage is preinstalled in wxt.dev

export const AUTHENTICATED_KEY = 'local:authenticated';

export class ReactiveStorage {
	#authenticated: boolean | null;
	#subscribeToAuthenticated: ReturnType<typeof createSubscriber>;

	constructor(init: { authenticated: boolean | null }) {
		this.#authenticated = init.authenticated;
		this.#subscribeToAuthenticated = createSubscriber((update) => {
			const unwatch = storage.watch<string>(AUTHENTICATED_KEY, (value) => {
				this.#authenticated = value;
				update();
			});
			return unwatch;
		});
	}

	get authenticated() {
		this.#subscribeToAuthenticated();
		return this.#authenticated;
	}

	set authenticated(value: boolean | null) {
		storage.setItem<boolean>(AUTHENTICATED_KEY, value);
	}
}
```

Đoạn mã trên khá dài dòng và chỉ đóng gói một "storage item" là `authenticated`. Mỗi item mới cần phải thêm
một vài dòng tương ứng. Ta có thể tìm cách đóng gói giải pháp này một cách tự động / tổng quát hơn,
tuy nhiên mình chưa thấy cần thiết trong dự án, và cũng chưa tìm ra một cách nào hay, đặc biệt là để thõa
được phần Typescript generics.

## Khởi tạo với Svelte Context

Giả sử mình có một [popup entrypoint](https://wxt.dev/guide/essentials/entrypoints.html#popup) cần
sử dụng `ReactiveStorage`, mình có thể đóng gói nó trong Svelte context để tránh việc truyền props
lặp lại qua nhiều component:

<enhanced-code-block group display="files">

```typescript title="popup/popup.ts"
import { mount } from 'svelte';
import { storage } from '#imports'; // @wxt-dev/storage đã được cài đặt sẵn trong wxt.dev mặc định
/// :::diff +
import { ReactiveStorage, AUTHENTICATED_KEY } from '@/reactive-strorage.ts';
/// :::
import Popup from './popup.svelte';

(async function() {
  mount(Popup, {
    target: document.getElementById('app')!,
    /// :::diff +
    context: new Map([
      [
        'storage',
        new ReactiveStorage({
          authenticated: await storage.getItem<boolean>(AUTHENTICATED_KEY),
        }),
      ],
    ]),
    /// :::
  });
})();
```

```svelte title="popup/popup.svelte"
<!-- :::diff + -->
<script>
  import { getContext } from 'svelte';
  import type { ReactiveStorage } from '@/reactive-storage.ts';

  const storage = getContext<ReactiveStorage>('storage');
</script>

<p>
  {#if storage.authenticated}
  Authenticated
  {:else}
    Not authenticated
  {/if}
</p>
<!-- ::: -->
```

```html title="popup/index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Your Extension</title>
		<meta name="manifest.type" content="browser_action" />
	</head>
	<body>
		<div class="contents" id="app"></div>
    <!-- :::highlight -->
		<script type="module" src="./popup.ts"></script>
    <!-- ::: -->
	</body>
</html>
```

</enhanced-code-block>

Mỗi entrypoint đều cần thiết lập tương tự.

<div class="c-callout c-callout--success c-callout--icon-confetti">

Khi `authenticated` thay đổi giá trị, markup sẽ tự động cập nhật. Thay đổi này có thể đến từ script
background, content, hoặc thậm chí là thủ công bằng devtools của trình duyệt. Khá tiện lợi nhỉ?

</div>

Tận dụng tính reactivity này cũng là một giải pháp thay thế cho việc phải lắng nghe sự kiện và
truyền dữ liệu qua lại giữa các script background <-> content <-> popup <-> ...

## `getItem` có thể là async

Chú ý ở đoạn mã trong ví dụ trên, giá trị khởi tạo của `authenticated` được truyền vào constructor
của `ReactiveStorage`...

```typescript title="ReactiveStorage instantiation"
const reactiveStorage = new ReactiveStorage({
  authenticated: await storage.getItem<boolean>(AUTHENTICATED_KEY),
});
```

...chứ không xử lý bên trong constructor. Đây là lựa chọn cá nhân của mình, nhưng lý do chính là
vì `storage.getItem` trong `@wxt-dev/storage` là async. Xử lý bên trong constructor vẫn khả thi nhưng
ta sẽ không chắc được khi nào `authenticated` sẽ có giá trị thật, có khả năng dẫn đến chớp nháy trên giao diện
(flash of content).

Việc async này cũng là lý do mình dùng `#authenticated` là một trường nội bộ (private) làm trung gian thay vì gọi `storage.getItem` trực tiếp trong getter:

```typescript title="ReactiveStorage.authenticated"
class ReactiveStorage {
  get authenticated() {
    this.#subscribeToAuthenticated();
    return this.#authenticated;
  }
}
```

Cuối cùng, hãy chú ý mình dùng [Immediately-Invoked-Function-Expression (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) trong `popup/popup.ts` để tránh sử dụp top-level await, vì nó chưa chắc đã được hỗ trợ
trên tất cả các phiên bản trình duyệt:


```typescript title="popup/popup.ts - truncated"
(async function() {
  //...
  const authenticated = await storage.getItem<boolean>(AUTHENTICATED_KEY);
  // ...
})();
```

Nếu bạn dùng API storage khác, hãy kiểm tra tài liệujhướng dẫn và điều chỉnh cho phù hợp nhé!

## Sử dụng trong script

`ReactiveStorage` có khả năng sẽ vẫn hoạt động trong nhiều ngữ cảnh khác nhau.
Tuy nhiên mình chỉ cần nó trong các file Svelte (dùng trong markup).
Còn trong script (background, content, ...), mình sẽ dùng `storage` trực tiếp.
Nếu bạn có trường hợp nào sử dụng `ReactiveStorage` trong script, cho mình biết với.

## Kết

Hy vọng bài viết giúp ích cho bạn. Đoạn mã này mình vừa viết cách đây vài ngày thôi, nhưng hơi phấn
khích quá nên đi viết bài luôn. Bạn có thể tìm mình dưới tên [vnphanquang tại
Bluesky](https://bsky.app/profile/vnphanquang.com) hoặc qua [Discord của Svelte Việt
Nam](https://discord.sveltevietnam.dev). Hoan nghênh mọi phản hồi từ bạn.

Làm việc với Svelte 5 một thời gian, mình thấy rằng hiệu suất tăng đáng kể so với phiên bản trước.
Kết hợp với [wxt.dev](https://wxt.dev/) và hệ sinh thái Vite ngày nay thì không có gì phải phàn nàn.
Xin gởi lời cảm ơn sâu sắc đến những người đóng góp và bảo trì cho các framework này!
