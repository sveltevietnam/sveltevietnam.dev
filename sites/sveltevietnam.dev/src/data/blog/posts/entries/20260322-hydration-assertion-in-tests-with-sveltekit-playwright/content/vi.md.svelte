Dạo gần đây mình dần quan tâm hơn đến QA/QC. Viết test học được nhiều thứ khá vui, nhưng cũng có vài
vấn đề đau đầu. Đôi khi có một vài test case cứ thỉnh thoảng lại lỗi với tần suất và biểu hiện không
rõ ràng - trong kiểm thử được gọi là "flaky test". Đôi khi "hydration" chính là vấn đề tạo ra tính bất ổn đó.

Bài viết này chia sẻ cách mình kiểm tra hydration trong E2E/UAT test với Playwright trong bối cảnh
SvelteKit app. Ngoài việc cái thiện tính ổn định, việc kiểm tra hydration cũng có thể giúp phát hiện
sớm các vấn đề ngoài mong muốn tại runtime.

## Đưa tui code đi

Trong mã nguồn của ứng dụng, đánh dầu khi hydration đã hoàn tất:

```svelte title="+layout.svelte"
<script>
  import { onMount } from 'svelte';

  // :::highlight
  // :::focus
  onMount(() => {2
    document.documentElement.toggleAttribute('hydrated', true);
  });
  // :::
  // :::
</script>
```

Trong test, chờ cho hydration hoàn tất:

```ts title="suite.test.ts"
import { test, expect } from '@playwright/test';

test('...', async ({ page }) => {
  // Chờ hydration xong
  // :::highlight
  // :::focus
  await expect(page.locator(':root')).toHaveAttribute('hydrated');
  // :::
  // :::

  // thực thi tiếp câu lệnh khác
});
```

## Hydration là gì?

Để tránh dài dòng, mình trích dẫn từ [Svelte Documentation > Page
Options](https://svelte.dev/docs/kit/page-options):

> By default, SvelteKit will render (or prerender) any component first on the server and send it to
> the client as HTML. It will then render the component again in the browser to make it interactive
> in a process called hydration.

Nói ngắn gọn, hydration sẽ áp dụng các đoạn mã Javascript ta viết trong thẻ `<script>` tại các tệp
`.svelte`.

## Nguyên nhân của tính bất ổn

Hydration phải xong thì các logic tại runtime mới có thể hoạt động. Ví dụ điển hình là các phần tử
có thể tương tác được, ví dụ như một nút bấm mà handler `onclick` được khai báo trong mã nguồn. Các
nút bấm có hỗ trợ "progressive enhancement" (tạm dịch: nâng cao tăng dần) không nằm trong phạm vi
này, ví nó có thể hoạt động mà không cần Javascript, ví dụ như một thẻ `<a>` với thuộc tính `href`
trỏ đến một URL khác.

Thời gian để hoàn tất hydration phụ thuộc vào lượng Javascript cần tải (và tốc độ mạng, tuy có thể
không liên quan trong môi trường test cục bộ (local dev)). Trong môi trường tự động, các câu lệnh
test đôi khi được thực thi quá nhanh, trước khi hydration hoàn tất. Việc này không phải là vấn đề
trong các trường hợp cơ bản, nhờ vào tính năng [auto-waiting](https://playwright.dev/docs/actionability)
của Playwright. Tuy nhiên, tính bất ổn định vẫn có thể xảy ra do nhiều lý do, như ví dụ sau đây.

```ts title="suite.test.ts"
import { test, expect } from '@playwright/test';

test('flaky counter test due to hydration', async ({ page }) => {
  await page.goto('/counter');

  // Playwright thấy và bấm ngay nút vì đã được render bởi server.
  // Nếu hydration chưa xong, số đếm vẫn là 0.
  const incrementBtn = page.getByRole('button', { name: 'Increment' });
  await incrementBtn.click();

  // Có thể thất bại với "Expected: 1, Received: 0"
  await expect(page.getByText('Count is 1')).toBeVisible();
});
```

Đối tượng kiểm thử (test object) có thể là:

```svelte title="+page.svelte"
<script>
  let count = $state(0);

  function increment() {
    count += 1;
  }
</script>

<p>Count is {count}</p>
<button on:click={increment}>Increment</button>
```

## Kiểm tra hydration trong test

Để cải thiện tính ổn định, mình thường chỉ cho Playwright chờ hydration xong rồi mới đi thực thi các
câu lệnh test. Hiện tại chưa có cách thức chính quy nào từ SvelteKit để báo hiệu hydration đã hoàn
thành, vì vậy ta có thể thử nhiều cách. Cách đầu tiên mình thử là [chờ cho đến khi không còn network request nào](https://playwright.dev/docs/api/class-page#page-wait-for-load-state):

```ts
page.waitForLoadState('networkidle');
```

Tuy nhiên, cách này không được Playwright khuyến khích, và thực ra nó cũng không hoạt động tốt lắm
trong thực tế dự án của mình. Hơn nữa, nó có thể đội thời gian chạy test lên, và nếu ứng dụng có sử dụng
các thủ thuật polling thì cách này cũng không hiệu quả. Sau khi thử nhiều cách khác nhau với mục
tiêu cố gắng tối giản nhất có thể, thì cuối cùng mình chọn cách tiếp cận trực tiếp hơn, như đã
trình bày trong phần [Đưa tui code đi](#đua-tui-code-đi) ở trên. Tóm tắt là:

```ts title="Hydration signal"
// trong ứng dụng
document.documentElement.toggleAttribute('hydrated', true);

// trong test case
await expect(page.locator(':root')).toHaveAttribute('hydrated');
```

Cách này hoạt động được là vì mã Javscript trong `onMount` chỉ chạy trên client sau hydration. Nó
đòi hỏi là ta phải thêm một ít mã vào ứng dụng, nhưng không quá đáng kể và hiện tại là cách tốt
nhất mình tìm được. Việc này cũng có lợi thế là chỉ cần mở dev tools và nhìn cây DOM là ta có thể
trực quan biết được hydration đã xong chưa - có ích trong quá trình debug.

<div class="c-callout c-callout--info c-callout--icon-bulb">

Ngoài ra, thay vì dùng một thuộc tính boolean, ta có thể gán cho nó một dấu thời gian. Trong một số trường
hợp, việc này giúp phát hiện nếu hydration mất quá nhiều thời gian (v.d. trên mạng di động 3G). Khi đó,
ta có thể thực hiện một số hành động tương ứng (v.d. hiển thị thông báo cho người dùng). Bạn có thể xem thêm bài viết
"[Màn hình chờ với nâng cao tăng dần](/vi/blog/20231220-behind-the-screen-man-hinh-cho-voi-nang-cao-tang-dan#đuong-truyen-khong-on-đinh)"
chứa ví dụ cụ thể cho ý tưởng này.

</div>

### Kiểm tra hydration thường xuyên

Mình có sử dụng pattern [Page Object Model](https://playwright.dev/docs/pom) nên thường thêm một lớp
abstraction để tái sử dụng việc kiểm tra hydration này:

```ts title="CommonPageObjectModel.ts"
export class CommonPageObjectModel {
	public readonly page: Page;

  // gọi hàm này sau khi điều hướng đến bất cứ trang nào khác, nhớ await nhé!
	public hydrated() {
		return expect(this.page.locator(':root')).toHaveAttribute('hydrated');
	}
}
```

Việc kiểm tra thường xuyên như vậy giúp phát hiện được cả trường hợp hydration bị lỗi trong các lần
điều hướng giữa trang, chứ không chỉ lần đầu tiên tải trang.

<div class="c-callout c-callout--info">

Mình không có bằng chứng cụ thể. Nhưng với kinh nghiệm thực tiễn thì khi điều hướng giữa các trang
(client-side navigation), nếu hydration của trang tiếp theo bị lỗi, SvelteKit sẽ đi tải lại toàn bộ trang
(full-page load). Trong trường hợp đó, dù gì chúng ta sẽ cần phải kiểm tra hydration một lần nữa.
Vậy nên cứ điều hướng là kiểm tra hydration nhé.

</div>

## Phát hiện lỗi sớm

Khi hydration bị lỗi, dù là do môi trường phát triển không ổn định hay do lỗi không xác định
tại runtime trong production, thì các thông báo lỗi có thể không hữu ích lắm. Khi đó, chi tiết lỗi
mà Playwright báo về chỉ là hậu quả của việc hydration không hoạt động đúng -
kiểu như là triệu chứng chứ hông phải nguồn gốc của vấn đề. Vì vậy việc kiểm tra hydration ngay từ
ban đầu có thể giúp xác định lỗi chính xác hơn.

Điều này càng đúng với những ứng dụng làm tốt progressive enhancement. Ví dụ như một form có thể
hoạt động ngay cả khi không có Javascript (không cần hydration). Khi hydration bị lỗi, ứng dụng vẫn
hoạt động tương đối, nhưng không 100%. Ví dụ, client-side validation, hoặc thông báo đẩy (toast) nếu
được viết bằng Javascript sẽ không hoạt động. Việc phát hiện sớm những vấn đề như vậy trong môi trường test,
bằng cách đã nêu, trước khi ứng dụng được đưa vào production là cần thiết để đảm bảo một trải nghiệm tốt nhất cho người dùng cuối.

<div class="c-callout c-callout--warning">

Khi dùng tính năng thử nghiệm (tại thời điểm bài viết này) là [Async Svelte](https://svelte.dev/docs/svelte/await-expressions)
và [SvelteKit Remote Function](https://svelte.dev/docs/kit/remote-functions), mình có quan sát thấy
  hydration thỉnh thoảng bị lỗi.

</div>

## Kết

Ý tưởng đề ra tại bài viết này tương đối đơn giản: chờ cho hydration hoàn tất trước khi thực thi bất
cứ câu lệnh nào khác. Rất mong nhận được phản hồi và góp ý. Bạn có thảo luận thêm với mình tại
[vnphanquang trên Bluesky](https://bsky.app/profile/vnphanquang.com) hoặc qua
[Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Cảm ơn bạn đã đọc bài!

