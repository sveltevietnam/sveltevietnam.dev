<script>
  import imgScreenshot from '../images/screenshot.png?format=avif&imagetools';
</script>

Trong các dự án trước đây, mình đã nhiều lần sử dụng [Google Analytics](https://developers.google.com/analytics)
vì đặc tính phổ biến, tương đối dễ tích hợp, và nhiều tính năng. Tuy nhiên, Google có tiếng với
việc thu thập dữ liệu người dùng và gây nhiều quan ngại về quyền riêng tư. Gần đây mình đã
thử nghiệm [Umami], một công cụ thay thế có mã nguồn mở và trao quyền kiểm soát dữ liệu tốt hơn
cho cả nhà phát triển và người dùng.

Tích hợp Umami vào dự án Svelte/SvelteKit rất đơn giản. Bài viết này chia sẻ cách mình đã thực hiện
cấu hình này, và hy vọng giúp bạn có cái nhìn sơ lược về Umami.

## Cấu hình server & tài khoản

Umami có cung cấp [gói miễn phí](https://umami.is/pricing) thông qua giải pháp đám mây của họ, với một số tính năng cơ bản. Bạn có thể đăng ký tài khoản và thử nghiệm. Bên cạnh đó, Umami còn cung cấp [giải pháp self-hosting](https://umami.is/docs/guides/hosting), cho phép bạn tự cài đặt trên máy chủ của mình và làm chủ hoàn toàn dữ liệu thu thập. Bạn có thể thao khảo [Hướng dẫn cài đặt](https://umami.is/docs/install) để biết thêm chi tiết.

Trong thử nghiệm của mình, mình chọn cách tự cài đặt bằng [Docker](https://www.docker.com/) trên một máy [Raspberry Pi](https://www.raspberrypi.com/) ngay tại nhà, kết hợp với [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) để quản lý truy cập từ xa. Đây là giải pháp tiết kiệm chi phí nhất mình biết hiện nay, nhưng đòi hỏi có kiến thức cơ bản về quản trị hệ thống và hệ điều hành Linux (không quá khó đâu!). Mình không đi sâu về chi tiết ở đây để tránh dài dòng. Có thể mình sẽ chia sẻ trong một bài viết khác.

<div class="c-callout c-callout--info c-callout--icon-question">

Vì thu thập dữ liệu là tác vụ thứ cấp, nên nếu máy chủ cá nhân của ta không quá mạnh, hoặc có sự cố như mất điện, thì vẫn không ảnh hướng đến ứng dụng hay trải nghiệm người dùng.

</div>

Bạn có thể mở rộng ô dưới đây để tham khảo cấu hình Docker của mình:

```yaml title="docker-compose.yaml" src="../examples/docker-compose.yaml" collapsed
```

## Tích hợp Umami vào Svelte

Bạn chỉ cần thêm thẻ script tương ứng vào ứng dụng của mình, theo hướng dẫn tại [Umami > Collect Data](https://umami.is/docs/collect-data):

```svelte title="+layout.svelte"
<svelte:head>
  <script defer src={...} data-website-id={...} ></script>
</svelte:head>
```

Đoạn mã trên thêm vào đâu không quá quan trọng, chỉ cần nằm trong ứng dụng của bạn là được. Nếu dùng SvelteKit, bạn có thể thêm vào tệp `+layout.svelte` phù hợp. Ngoài ra, bạn có thể lưu trữ `src` và `data-website-id` trong biến môi trường để dễ dàng bật/tắt hoặc thay đổi theo từng môi trường (development, staging, production, etc.). Ví dụ:

```svelte title="+layout.svelte"
{#if PUBLIC_UMAMI !== '0' && PUBLIC_UMAMI !== 'false'}
  <script
    defer
    src={PUBLIC_UMAMI_SCRIPT_URL}
    data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
  ></script>
{/if}
```

Vậy là xong! Qua thử nghiệm của mình, Umami sẽ tự hoạt động cho cả điều hướng client-side và server-side, mình không cần phải can thiệp gì thêm.

<figure>
  <img src={imgScreenshot} class="mx-auto max-w-full rounded" width="600" height="344" alt="" />
  <figcaption>Chụp màn hình: giao diện dashboard Umami thực tế</figcaption>
</figure>

## Thêm thông tin session

[Session properties](https://umami.is/docs/sessions) trong Umami giúp bạn thu thập thêm thông tin bổ sung về người dùng, ví dụ như các tùy chỉnh cá nhân hoặc hệ thống. Để thêm thông tin này, bạn cần gọi hàm `umami.identify`. Dưới đây là một ví dụ cách thực hiện điều này trong Svelte:

```svelte title="+layout.svelte"
<script>
	function handleUmamiLoad() {
		console.log('umami loaded');
		window.umami?.identify({
			language: settings.language,
			systemColorScheme: settings.colorScheme.system,
			userColorScheme: settings.colorScheme.user,
      // ...
		});
	}
</script>

<script onload={handleUmamiLoad} {...}></script>
```

Script của Umami sẽ thêm đối tượng `umami` vào `window`, tuy nhiên, ta không biết chắc được khi nào script này đã được tải xong. Mình lắng nghe sự kiện `onload` như trên là để khắc phục vấn đề này.

## Hỗ trợ Typescript

Hiện tại chưa có hướng dẫn chính thức để thích hợp Typescript cho Umami. Tuy nhiên, mình sẽ giới
thiệu một cách tạm thời sau đây. Trước tiên bạn cần cài đặt gói sau:

```bash
pnpm add -D @types/umami-browser
```

Sau đó, thêm đoạn mã sau vào tệp `.d.ts` toàn cục (thường là `src/app.d.ts` hoặc `src/global.d.ts`):

```typescript title="src/app.d.ts"
// :::diff +
/// <reference types="umami-browser" />
// :::
declare global {
  // :::diff +
  interface Window {
    umami?: umami.umami;
  }
  // :::
}
```

## Kết

Khá dễ dàng đúng không nào? Để thảo luận thêm về bài viết, bạn có thể tìm mình tại [vnphanquang trên Bluesky](https://bsky.app/profile/vnphanquang.com) hoặc thông qua [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Cảm ơn bạn đã đọc bài!

[umami]: https://umami.is/
