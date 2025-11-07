<script>
	import { SettingsContext } from '$lib/settings/context.svelte';
  import imgScreenshotSearchDialog from '../images/search-dialog-screenshot.vi.png?format=avif&imagetools';

	const settings = SettingsContext.get();
</script>

Nếu bạn đang sử dụng bàn phím, hãy thử nhấn tổ hợp phím
<span class="c-text-body-xs">
  {#if settings.platform === 'apple'}
    <kbd>⌘</kbd>
  {:else}
    <kbd>Ctrl</kbd>
  {/if}
  <kbd>K</kbd>
</span>
(hoặc nhấn tìm kiếm <i class="i i-[ph--magnifying-glass] w-5 h-5"></i> tại thanh công cụ phía trên cùng của trang) để kích hoạt hộp thoại tìm kiếm. Tính năng này sử dụng [Pagefind] để thực hiện thao tác truy vấn bằng từ khóa trên các trang tại sveltevietnam.dev.

<figure>
  <img src={imgScreenshotSearchDialog} class="w-full border border-outline" width="800" height="475" alt="" />
  <figcaption>Chụp màn hình: hộp thoại tìm kiếm với từ khóa "thiết kế"</figcaption>
</figure>

Bài viết này giới thiệu một giải pháp tích hợp Pagefind vào dự án SvelteKit nói chung, và dự án sử dụng SSR nói riêng.

## Tổng quan về Pagefind và vấn đề với SSR

Tại thời điểm xây dựng ứng dụng, Pagefind sẽ đọc các trang khả dụng, xử lý ngôn ngữ tự nhiên từ nội dung trang, và xây dựng một index (chỉ mục). Khi người dùng nhập từ khóa tìm kiếm, Pagefind sẽ sử dụng index đó để trả về các kết quả phù hợp nhất.

Để Pagefind có thể xây dựng index, ta cần chủ động cung cấp các tệp HTML thông qua [CLI](https://pagefind.app/docs/running-pagefind/) hoặc [Node API][pagefind.node]. Ví dụ, câu lệnh theo hướng dẫn của pagefind:

```bash
npx pagefind --site public
```

thật ra là bảo Pagefind "hãy tìm và index tất cả tệp HTML trong thư mục `public`". Nếu bạn sử dụng [adapter-static](https://svelte.dev/docs/kit/adapter-static) hoặc [prerender][sveltekit.prerender] các trang cần index, các tệp HTML tương ứng sẽ được tạo ra trong quá trình build, việc còn lại chỉ là chạy lệnh vừa rồi với thư mục thích hợp.

Tuy nhiên, với các ứng dụng SSR, sẽ không có tệp HTML được tao ra trong quá trình build. Đây là vấn đề mấu chốt mà mình cần giải quyết.

## Sơ lược về hướng giải quyết

Sau đây là giải pháp mình đã thử nghiệm thành công để giúp Pagefind index các trang SSR:

1. xây dựng toàn bộ ứng dụng (`vite build` hay lệnh tương tự),
2. chạy preview server (`vite preview` hay lệnh tương tự),
3. request sitemap (`/sitemap.xml` hay trang tương tự) từ preview server để lấy danh sách các trang cần index,
4. fetch HTML đã SSR từ từng trang trong danh sách từ (3),
5. sử dụng dữ liệu từ (3) và (4) làm đầu vào, thông qua [Node API][pagefind.node], để tạo index cho
   Pagefind.

Để tự động hóa quá trình trên và bảo đảm tính nhất quán và tiện lợi cho dự án, mình đóng gói quy trình trên thông qua một [Vite plugin](https://vite.dev/guide/using-plugins).

<div class="c-callout c-callout--info">

Có thể bạn thấy việc viết một Vite plugin là phức tạp so với script NodeJS thông thường. Tuy nhiên, Vite plugin là một giải pháp thích hợp cho trường hợp này, vì tác vụ của chúng ta đi liền với quá trình dev / build, mà các quá trình này đều được quản lý bởi Vite.

Làm quen được với bộ công cụ mà Vite cung cấp đã giúp mình giải quyết rất nhiều vấn đề trong công việc lập trình web nói chung. Đó cũng là lý do hệ sinh thái hiện tại đang đồng quy tại một điểm chung là Vite — bản thân Svelte và SvelteKit về cơ bản cũng chỉ là các Vite plugin mà thôi. Nếu bạn chưa từng nghĩ đến việc này, mình rất khuyến khích bạn tìm hiểu thêm nhé!

</div>

## Vite plugin

Bạn có thể tham khảo mã nguồn cụ thể của plugin đã nêu [tại đây](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/sveltevietnam.dev/src/lib/pagefind/vite.ts), hoặc thông qua đoạn mã bên dưới (mở
rộng để xem):

```ts title="pagefind/vite.ts" src="../../../../../lib/pagefind/vite.ts" collapsed
```

Mình sẽ không đi chi tiết đoạn mã trên, nhưng sau đây là một vài điểm chính.

### Thành phần

Giải pháp gồm 2 plugin con:

1. plugin chạy trong quá trình dev, tạo ra index rỗng để tránh gây lỗi vì không tìm thấy index,
2. plugin chạy trong quá trình build, thực hiện các bước đã nêu ở phần trước, đồng thời cập nhật index này cho quá trình dev về sau.

### Hook, environment, và trình tự

Lựa chọn [hook](https://vite.dev/guide/api-plugin.html#universal-hooks) và [môi trường (Vite environment)](https://vite.dev/guide/api-environment) phù hợp, và trình tự chạy plugin là một việc quan trọng.

Cụ thể, plugin dev cần được chạy trước khi dev server được khởi động, và plugin build cần được chạy sau khi quá trình build của SvelteKit đã hoàn tất, nhưng trước khi sao chép các tệp tùy theo adapter được sử dụng (để không phải phụ thuộc vào adapter hay tùy chỉnh của dự án).

Bên cạnh đó, tại thời điểm viết bài này, SvelteKit build cho hai môi trường, `client` và `ssr`. Ta cần chạy plugin build trong môi trường `ssr` để bảo đảm ứng dụng đã sẵn sàng để chạy trên preview server.

### NodeJS

Hiện tại, plugin của mình phụ thuộc vào một số API của NodeJS, cụ thể là `node:child_process` để chạy preview server, `node:fs`, `node:path`, `node:process` để thao tác với filesystem. Các tác vụ này cần được thay thế để thích nghi với các runtime khác như Deno hoặc Bun.

Cũng vì lý do này, CI/CD của bạn sẽ lỗi nếu chạy trên môi trường không hỗ trợ NodeJS — một điểm cần lưu ý nếu bạn muốn ứng dụng giải pháp tương tự vào dự án của bạn.

<div class="c-callout c-callout--success">

Plugin này hoạt động tốt với Cloudflare trong thử nghiệm của mình.

</div>

### Mở rộng

#### Single Page Application (SPA)

Về lý thuyết, ta có thể phát triển trên ý tưởng này để index các
trang từ ứng dụng SPA, bằng cách sử dụng [puppeteer](https://pptr.dev/) hoặc các công cụ giả lập
trình duyệt tương tự.

#### Sử dụng với các adapter khác trong SvelteKit

Mình chưa thử nghiệm hết với tất cả các adapter hiện tại trong hệ sinh thái Svelte, nhưng phỏng đoán rằng giải pháp này sẽ hoạt động với đa số các adapter. Tuy nhiên, có thể sẽ cần điều chỉnh và cung cấp tùy chọn cho người sử dụng để thích ứng theo nhu cầu.

#### Có nên đóng gói thành thư viện?

Plugin này có thể được đóng gói để tải sử dụng dễ hơn. Tuy nhiên, mình chưa có thời gian để kiểm thử và hoàn thiện. Nếu bạn nghĩ mình nên làm thành thư viện, hãy cho mình biết nhé!

## Tải pagefind trong trình duyệt

Một vấn đề khác trong Pagefind là việc tải script trong trình duyệt. Pagefind được build như một
[tài nguyên tĩnh (static asset)](https://vite.dev/guide/assets) — ví dụ như qua plugin trên sẽ là thư mục `/static/pagefind`.
Vite hiện tại không hỗ trợ import JS từ thư mục này:

```js title="search.js"
// :::highlight error
import pagefind from '/pagefind/pagefind.js';
// :::
// Error:
// Cannot import non-asset file /pagefind/pagefind.js which is inside /public.
// JS/CSS files inside /public are copied as-is on build and can only be referenced
// via script or link tags in html. If you want to get the URL of that file,
// use /pagefind/pagefind.js?url instead
```

Có một số giải pháp cho vấn đề này, nhưng sau khi thử nghiệm nhiều cách, mình đã quyết định theo hướng đơn giản như sau:

```svelte title="search.svelte"
<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  onMount(() => {
    // :::highlight
    // :::focus
    import(/* @vite-ignore */ `${origin}/pagefind/pagefind.js`).then((pagefind) => {
    // :::
    // :::
      pagefind.init();
      pagefind.search({ /* ... */ });
    });
  });
</script>
```

Phương pháp này sử dụng [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import). Chú ý:

- `/* @vite-ignore */` là chỉ thị để `vite:import-analysis` không xử lý import này,
- tiền tố `origin` là cần thiết, nếu không mình vẫn gặp lỗi tương tự như trên.

## Hỗ trợ Typescript

Hiện tại chưa có một hướng dẫn chính thức để hỗ trợ Typscript cho Pagefind. Tuy nhiên, bạn chỉ cần thêm tệp `src/pagefind.d.ts` vào dự án của bạn với nội dung như sau:

```ts title="src/pagefind.d.ts" src="../../../../../pagefind.d.ts"
```

Sau đó, bạn có thể áp dụng các type phù hợp qua `import('@pagefind')`:

```ts title="search.svelte"
<script lang="ts">
  // ...
  onMount(() => {
    // :::highlight
    // :::focus
    import(/* @vite-ignore */ `${origin}/pagefind/pagefind.js`).then((pagefind: import('@pagefind').default) => {
    //:::
    //:::
      // ...
    });
  });
</script>
```

## Kết

Trên đây mình đã giới thiệu vắn tắt cách tích hợp Pagefind vào dự án SvelteKit nói chung, và SSR nói riêng. Hy vọng thông tin này sẽ hữu ích cho ứng dụng của bạn. Nếu có góp ý hoặc câu hỏi, bạn có thể tìm mình tại [vnphanquang trên Bluesky](https://bsky.app/profile/vnphanquang.com) hoặc tại [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Cảm ơn bạn đã đọc bài!

[pagefind]: https://pagefind.app
[pagefind.node]: https://pagefind.app/docs/node-api
[sveltekit.prerender]: https://svelte.dev/docs/kit/page-options#prerender
