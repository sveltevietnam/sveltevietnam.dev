<script>
  import BaseNotification from '$lib/notifications/BaseNotification.svelte';
  import { SplashPlayground } from '$lib/components/SplashPlayground';

  import hydrationImage from './images/hydration-vi.png?format=webp&imagetools';
  import blockingRenderImage from './images/blocking-render.png?format=webp&imagetools';
  import splashScreenImage from './images/splash-screen.png?format=webp&imagetools';
  import vanillaImage from './images/vanilla.png?format=webp&imagetools';
  import repetitionImage from './images/repetition-vi.png?format=webp&imagetools';
  import hydrationDuringSplashImage from './images/hydration-during-splash.png?format=webp&imagetools';
  import hydrationAfterSplashImage from './images/hydration-after-splash.png?format=webp&imagetools';
</script>

:::div c-callout c-callout--info
Bài viết này nằm trong chuỗi bài viết "Behind the Screen", nơi mình chia sẻ những kinh nghiệm và bài học trong quá trình xây dựng *sveltevietnam.dev*. Bạn có thể tìm đọc phần trước tại "[Một vài bí mật về sveltevietnam.dev](/vi/blog/20231204-behind-the-screen-mot-vai-bi-mat-ve-sveltevietnam-dev)".
:::

Trong phần trước, mình có đề cập sơ lược về màn hình chờ (splash screen). Màn hình này hiển thị ngay lúc đầu khi trang vừa được tải và thực hiện một số hiệu ứng chuyển động giúp thu hút sự chú ý của người dùng và chào đón họ vào trang. Để kích hoạt màn hình chờ, bạn có thể tải lại trang (ctrl/cmd + R). Nếu bạn không dùng Javascript, hãy tắt hẳn tab trình duyệt và mới trang mới.

Trong bài viết này ta sẽ tìm hiểu chi tiết hơn về giá trị thực tế mà màn hình chờ mang lại cho người dùng, cũng như cách mà *sveltevietnam.dev* thiết lập màn hình chờ để phục vụ nhiều người dùng nhất có thể, kể cả người dùng không sử dụng Javascript.

## Không chỉ để vui

Thoạt nhìn màn hình chờ trông có vẻ chỉ phục vụ mục đích hoạt ảnh và giải trí. Đối với người dùng, nhận thức đó là hoàn toàn đúng và đủ. Tuy nhiên, trên phương diện kĩ thuật, màn hình chờ còn là một phương pháp "câu giờ" trong khi hệ thống đang tải các tài nguyên thiết yếu và chuẩn bị để trang web hoạt động một cách tốt nhất. Quá trình này được gọi là "[hydration](https://kit.svelte.dev/docs/glossary#hydration)" và thường gặp trong hầu hết các framework phổ biến ngày nay. Nói ngắn gọn, hydration là giai đoạn chuyển hóa một trang web tĩnh thành động bằng cách thiết lập môi trường phù hợp để framework thực hiện các kỹ thuật cập nhật DOM theo tương tác của người dùng và biến đổi của hệ thống. Nói cách khác, nếu bạn viết Javascript trong ngữ cảnh của framework (React, Vue, Svelte, ...), các đoạn mã đó chỉ có hiệu lực sau khi hydration đã hoàn thành.

<figure>
  <img src={hydrationImage} class="mx-auto max-w-full rounded" width="800" height="475" alt="minh họa hydration: bên phải chưa hydration, trang web tĩnh, chỉ có HTML, CSS, và vanilla JS. Bên phải đã hydration, trang web động trong môi trường Javascript framework" />
  <figcaption>Minh họa 1: quá trình hydration thiết lập môi trường cho framework</figcaption>
</figure>

Đối với các trang có nhiều hiệu ứng (transition, animation), đặc biệt là hiệu ứng phụ thuộc vào Javascript như [GSAP](https://gsap.com/) hay [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), một vấn đề thường gặp là trang sẽ bị chớp nháy ngay sau khi hydration vừa hoàn thành. Nhiều trang web, đặc biệt là các ứng dụng đơn trang, giải quyết điều này bằng cách chặn cho nội dung không được hiển thị cho đến khi Javascript đã tải xong (hydration đã hoàn thành). Dễ hiểu rằng việc này gây ra hai hệ quả:

1. Trang web sẽ không thể dùng được cho đến khi hydration đã hoàn thành. Khi đường truyền không ổn định, quá trình tải tài nguyên bị trì hoãn và người dùng có thể phải chờ một khoảng thời gian lâu trước khi có thể nhìn thấy nội dung.
2. Với người dùng không sử dụng Javascript, trang web sẽ trở nên vô dụng vì không có nội dung nào được hiển thị, và hydration không bao giờ diễn ra.

<figure>
  <img src={blockingRenderImage} class="mx-auto max-w-full rounded" width="600" height="370" alt="minh họa giải pháp chặn hiển thị" />
  <figcaption>Minh họa 2: giải pháp chặn hiển thị</figcaption>
</figure>

:::div c-callout c-callout--info
Ở ý (2), có thể bạn thấy lạ rằng vì sao lại có người dùng không sử dụng Javascript. Mình có đề cập đến [điều này trong bài viết trước](/vi/blog/20231204-behind-the-screen-mot-vai-bi-mat-ve-sveltevietnam-dev#kh%C3%B4ng-javascript-kh%C3%B4ng-lo). Việc này xảy ra nhiều hơn ta thường nghĩ, và bất cứ người dùng nào cũng có thể rơi vào tình huống đó. Bạn hãy xem [sơ đồ này](https://www.kryogenix.org/code/browser/everyonehasjs.html) để hiểu thêm.
:::

Như vậy, giải pháp chặn hiển thị nội dung tuy đơn giản nhưng không mang lại trải nghiệm tốt nhất. Để giải quyết cả hai hệ quả trên, ta cần phải biểu hiện nội dung từ phía máy chủ (server-side-rendering), và gởi trực tiếp HTML, CSS cho trình duyệt hiển thị ban đầu, sau đó để hydration diễn ra một cách tự nhiên. Thế nhưng khi đấy ta lại quay trở về vạch xuất phát với vấn đề ban đầu: làm sao che đi việc chớp nháy do hiệu ứng trên trang khi hydration vừa hoàn thành? Giải pháp thứ hai chính là hiển thị màn hình chờ.

<figure>
  <img src={splashScreenImage} class="mx-auto max-w-full rounded" width="600" height="370" alt="minh họa giải pháp màn hình chờ" />
  <figcaption>Minh họa 3: giải pháp màn hình chờ</figcaption>
</figure>

Đương nhiên, giải pháp này cũng không tránh khỏi một số vấn đề mà ta sẽ bàn đến ở các phần tiếp theo.

## Có nên dùng màn hình chờ?

Từ khi bài viết này được đăng, mình có nhận được một vài phản hồi rằng màn hình chờ, hay nói chung là những giao diện chờ (loading indicator), có thể tạo nên "cảm giác" trang web chậm hơn thực tế, làm ảnh hướng đến trải nghiệm người dùng. Nhìn chung, mình đồng ý với quan điểm này, và muốn mở rộng thêm rằng ta lúc nào cũng nên cố gắng cải thiện và tối ưu hóa để trang thực sự nhanh hơn, đặc biệt là nếu trang web mang tính cấp bách, nội dung cần được hiển thị sớm nhất có thể.

:::div c-callout c-callout--success
Với *sveltevietnam.dev*, màn hình chờ có nhiệm vụ chính là tạo nên một hoạt cảnh ấn tượng lôi cuốn người dùng, và cũng là cái cớ để chúng mình thể hiện sức sáng tạo. Đó là lý do nó được thiết kế để chạy trong thời gian ngắn và không lặp lại, như bạn sẽ thấy ở phần sau. Tính chất "che đi qua trình tải trang" là sản phẩm phụ may mắn đi kèm với màn hình chờ này.

Bạn có thấy trang *sveltevietnam.dev* chậm? Hãy phản hồi cho tụi mình biết qua [Discord](https://discord.sveltevietnam.dev). Trường hợp bạn không muốn thấy màn hình chờ nữa, hãy [vào trang cài đặt](/vi/cai-dat) (hoặc nhấn vào icon tương ứng ở góc trên bên phải) và tắt màn hình chờ nhé!
:::

Tùy vào trường hợp, bạn nên thảo luận với team và cân nhắc cẩn thận, xem xét giá trị thực tế mà màn hình chờ mang lại cho ứng dụng và người dùng. Nhưng đừng quá lo lắng, dù gì đi nữa, các kỹ thuật được giới thiệu trong bài viết này cũng có thể áp dụng cho các vấn đề khác, không chỉ riêng màn hình chờ!

## Vanilla

Theo những ràng buộc mình đã trình bày ở phần trước, màn hình chờ cần thỏa mãn các điều kiện cơ bản sau:

1. hiển thị đầu tiên, nằm phía trên che đi nội dung của trang web,
2. phải hoạt động kể cả khi người dùng không sử dụng Javascript,
3. diễn ra độc lập và không bị ảnh hưởng bởi quá trình hydration.

Nói cách khác, màn hình chờ cần được thiết lập bằng HTML và CSS thuần túy và không phụ thuộc vào Javascript. Đặc biệt là, nó phải nằm ngoài phạm vi ảnh hưởng của framework, vì nếu không thì các hiệu ứng hoạt ảnh trong màn hình chờ sẽ bị giật và lặp lại khi hydration hoàn thành.

:::div c-callout c-callout--info
Khi hydration xảy ra, các phần tử DOM có thể bị thay thế (rerender, remount), khiến cho hiệu ứng CSS bị khởi động lại. Đã có nhiều thảo luận về vấn đề này (issue [#4308](https://github.com/sveltejs/svelte/issues/4308), [#8194](https://github.com/sveltejs/svelte/issues/8194), [#8209](https://github.com/sveltejs/svelte/issues/8209), [#7775](https://github.com/sveltejs/kit/issues/7775)), nhưng hiện tại chưa có giải pháp dứt khoát để khắc phục từ phía framework. Dù có dùng framework nào đi nữa, ta nên tách biệt màn hình chờ khỏi quá trình hydration, để bảo đảm tính độc lập và ổn định.
:::

Sử dụng vanilla? Nghe thật lạ lùng trong thời buổi ngày nay với 1001 framework frontend đúng không nào? Có thể bạn đã từng được khuyên rằng không nên sử dụng vanilla, chỉ nên dùng những gì framework cung cấp. Mình xin bảo đảm với bạn rằng: dùng vanilla là hoàn toàn bình thường, thậm chí là cần thiết trong các tình huống tiêu biểu như trong bài viết này. Hãy nhớ rằng, framework sẽ thay đổi, nhưng các nền tảng vanilla (HTML, CSS, JS) vẫn sẽ ở đấy.

Trong Svelte và SvelteKit, có nhiều cách để áp dụng một đoạn mã HTML vanilla ngoài phạm vi hydration. Cách đơn giản nhất ta sẽ sử dụng là thêm mã trực tiếp vào `app.html`:

```svelte
/// filename=src/app.html
<!doctype html>
<html>
  <head>...</head>
  <body>
    <!-- :::highlight -->
    <div id="splash">
      <!-- "vanilla", độc lập đối với framework và quá trình hydration -->
    </div>
    <!-- ::: -->

    <div class="contents">
      <!-- phạm vi HTML được hydration -->
      %sveltekit.body%
    </div>
  </body>
</html>
```

Nếu bạn chưa biết, `app.html` là tệp mẫu SvelteKit dùng để biểu hiện nội dung trang, trước khi gởi về cho trình duyệt. Hydration sẽ diễn ra tại `%sveltekit.body%`. Xem thêm [phần "Project files" trong tài liệu của SvelteKit](https://kit.svelte.dev/docs/project-structure#project-files) để biết thêm chi tiết. `div#splash` của chúng ta nằm ngoài `%sveltekit.body%` nên sẽ không bị ảnh hưởng bởi hydration. Tiếp theo, đối với CSS, ta sẽ khai báo một tệp riêng...

```css
/// filename=splash.css
#splash {
  /* style và hiệu ứng phù hợp */
}
```

...và nhập tệp này trực tiếp vào `+layout` hoặc `+page` phù hợp. Ví dụ, để áp dụng lên tất cả các trang, hãy nhập vào tệp `+layout` gốc:

```svelte
/// filename=src/routes/+layout.svelte
<script>
  import 'path/to/splash.css';
</script>
```

:::div c-callout c-callout--info
Chú ý rằng ta có thể trực tiếp khai báo tệp `splash.css` tại `app.html`. Tuy nhiên, khi làm vậy tệp `splash.css` được xem như là một tài nguyên tĩnh (static asset) và ta sẽ không thể sử dụng CSS preprocessor như Sass hay PostCSS. CSS không bị ảnh hưởng bởi hydration, vì vậy ta vẫn có thể tải từ các tệp `*.svelte` trong ngữ cảnh Svelte và SvelteKit, khá là tiện lợi!
:::

<figure>
  <img src={vanillaImage} class="mx-auto max-w-full rounded" width="680" height="328" alt="minh họa tích hợp vanilla splash.css và app.html với SvelteKit" />
  <figcaption>Minh họa 4: màn hình chờ vanilla trong ngữ cảnh SvelteKit</figcaption>
</figure>

Chi tiết thực hiện HTML và CSS của màn hình chờ là tùy thuộc vào ứng dụng và thiết kế của dự án. Bạn có thể tham khảo màn hình chờ của *sveltevietnam.dev* tại [app.html](https://github.com/sveltevietnam/sveltevietnam.dev/blob/fd1a7cdea3b63f53c19bb7ce6bec23f902ae3f24/sites/www/src/app.html#L47-L80) và [splash.css](https://github.com/sveltevietnam/sveltevietnam.dev/blob/fd1a7cdea3b63f53c19bb7ce6bec23f902ae3f24/libs/ui/css/components/c-splash.css). Nhìn chung, màn hình chờ thường có hai đặc điểm sau:

- có `position` là `fixed` hoặc `absolute`, với `z-index` thích hợp để che nội dung trang bên dưới,
- có hiệu ứng tương đối đơn giản, kéo dài từ 1-3 giây, hiệu ứng cuối cùng nên di chuyển cả phần tử màn hình chờ ra khỏi viewport để người dùng có thể tương tác được với trang web.

Về cơ bản, đến đây màn hình chờ đã hoạt động. Ở các phần sau, ta tập trung cải thiện cho những tình huống đặc biệt hơn để cung cấp trải nghiệm tốt nhất cho người dùng.

## Tránh lặp lại khi điều hướng

Màn hình chờ chỉ nên xuất hiện một lần khi người dùng vừa truy cập chứ không nên lặp lại mỗi khi điều hướng giữa các trang. May mắn là, nếu bạn dùng SvelteKit và [client-side-rendering (CSR) được bật](https://kit.svelte.dev/docs/page-options#csr), trang web sẽ sử dụng client-side router để điều hướng một cách thông minh mà không cần khởi tạo lại trang web: có nghĩa là màn hình chờ sẽ không bị lặp lại. Lúc này, vì hydration đã hoàn thành, các tài nguyên Javascript thiết yếu đã được tải, và trang web đã nằm trong môi trường framework, ta sẽ không gặp phải vấn đề chớp nháy trong quá trình điều hướng sang trang khác.

Tuy nhiên, trong trường hợp bạn không dùng CSR hoặc người dùng không sử dụng được Javascript, mỗi điều hướng được xem như một trang web mới hoàn toàn, HTML của cả trang sẽ được khởi tạo lại, và màn hình chờ sẽ lặp lại. Để khắc phục tình huống này, ta cần thêm xử lý ở phía máy chủ với ý tưởng như sau:

1. Nếu người dùng vào trang web lần đầu, hiển thị màn hình chờ.
2. Nếu người dùng điều hướng nội bộ từ trong trang web (ví dụ từ trang `/a` trong `/b`), không hiển thị lại màn hình chờ.

<figure>
  <img src={repetitionImage} class="mx-auto max-w-full rounded" width="800" height="173" alt="minh họa: tránh lặp lại khi điều hướng" />
  <figcaption>Minh họa 5: chỉ hiển thị màn hình chờ cho lần điều hướng đầu tiên</figcaption>
</figure>

Trước tiên, ta thêm một thuộc tính vào phần tử `div#splash`:

```svelte
/// filename=src/app.html
<!doctype html>
<html>
  <head>...</head>
  <body>
    <!-- :::diff - -->
    <div id="splash">
    <!-- ::: -->
    <!-- :::diff + -->
    <div id="splash" data-splash-skip="%splash-skip%">
    <!-- ::: -->
      ...
    </div>
    ...
  </body>
</html>
```

`%splash-skip%` sẽ được thay thế bằng `true` hay `false` tùy vào tình huống (1) hay (2), từ phía server bằng tệp `hooks.server`:

```javascript
/// filename=src/hooks.server.js

/** @type {import('sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  const { url, request, locals } = event;

  // kiểm tra header Referer để biết người dùng vừa điều hướng từ đâu
  const referer = request.headers.get('Referer');
  if (referer) {
    const urlReferer = new URL(referer);
    if (urlReferer.origin === url.origin) {
      locals.internalReferer = urlReferer;
    }
  }

  await resolve(event, {
    // :::highlight
    transformPageChunk: ({ html }) => html.replace('%splash-skip%', String(!!locals.internalReferer)),
    // :::
  });
};
```

Bạn có thể kiểm tra đoạn mã đã hoạt động đúng chưa bằng cách tắt Javascript trên trang. Nếu dùng các trình duyệt trên nền Chromium, bạn có thể theo các bước sau:

- mở devtool,
- nhấn tổ hợp phìm Ctrl/Cmd + Shift + P để mở command palette,
- gõ "Disable Javascript" và nhấn enter hoặc chọn lựa chọn phù hợp trong danh sách kết quả.

Để bật lại Javascript, thực hiện các thao tác tương tự nhưng thay câu lệnh bằng "Enable Javascript". Phần còn lại, ta chỉ cần chỉnh sửa `splash.css` tương ứng để ẩn đi màn hình chờ nếu `data-splash-skip` là `true`:

```css
/// filename=splash.css
#splash {
  /* :::diff + */
  &[data-splash-skip="true"] {
    display: none;
  }
  /* ::: */
}
```

## Đường truyền không ổn định

Trong trường hợp mọi thứ đều tốt đẹp, hydration sẽ diễn ra trong khi màn hình chờ đang chạy, và hệ thống đã chuẩn bị đầy đủ để đón tiếp người dùng. Ngay sau khi màn hình chờ kết thúc, người dùng có thể bắt đầu tương tác với trang.

<figure>
  <img src={hydrationDuringSplashImage} class="mx-auto max-w-full rounded" width="800" height="173" alt="minh họa: hydration hoàn thành trước khi màn hình chờ kết thúc" />
  <figcaption>Minh họa 6.1: hydration hoàn thành trước khi màn hình chờ kết thúc</figcaption>
</figure>

Nhưng khi mạng chậm, hydration bị trì hoãn và diễn ra sau khi màn hình chờ đã kết thúc. Lúc này, vì trang web đã được biểu hiện trước từ phía máy chủ, người dùng vẫn có thể đọc nội dung trên trang, nhưng những tính năng cần có Javascript sẽ không sử dụng được cho đến khi hydration đã hoàn thành.

<figure>
  <img src={hydrationAfterSplashImage} class="mx-auto max-w-full rounded" width="800" height="173" alt="minh họa: hydration hoàn thành sau khi màn hình chờ kết thúc" />
  <figcaption>Minh họa 6.2: hydration hoàn thành sau khi màn hình chờ kết thúc</figcaption>
</figure>

Ngoài ra, trong tình huống này, ta không thể tránh được việc trang web bị chớp nháy một tí, như đã bàn ở các phần trước. Tuy nhiên, ta có thể thông báo cho người dùng để họ hiểu được vì sao điều này xảy ra. Cách xử lý này dựa vào nguyên tắc cơ bản của thiết kế trải nghiệm người dùng: luôn giao tiếp và cung cấp thông tin về những thay đổi của hệ thống. Đây là thông báo từ *sveltevietnam.dev* cho tình huống này:

:::div not-prose
<BaseNotification intent="info">
  <p>Phát hiện gián đoạn do kết nối không ổn định. Xin lỗi bạn vì sự bất tiện này!</p>
</BaseNotification>
:::

Để làm được điều đó, ta cần phát hiện được khi nào hydration hoàn thành sau màn hình chờ. Trước hết, ta lưu lại mốc thời gian khi màn hình chờ vừa kết thúc:

```svelte
/// filename=src/app.html
<html>
  <body>
    <div id="splash">...</splash>

    <!-- :::diff + -->
    <script>
      function stamp() {
        document.documentElement.setAttribute('data-splashed-at', new Date().toISOString());
      }

      const splashEl = document.getElementById('splash');
      if (!splashEl || splashEl.getAttribute('data-splash-skip')) {
        stamp();
      } else {
        splashEl.addEventListener('animationend', (e) => {
          // :::highlight warning
          if (!splashEl.isSameNode(e.target)) return;
          // :::
          stamp();
        });
      }
    </script>
    <!-- ::: -->
  </body>
</html>
```

:::div c-callout c-callout--warning
Lưu ý: bạn cần bắt đúng sự kiện `animationend` vì màn hình chờ có thể có nhiều hiệu ứng trên nhiều phần tử HTML. Khi hiệu ứng kết thúc ở phần từ nào, phần tử đó sẽ phát ra sự kiện `animationend` và [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling) lên trên. Trong ví dụ trên, hiệu ứng cuối cùng nằm tại chính phần tử `div#splash`.
:::

Ở đây, bạn lại thấy ta đã dùng vanilla JS cho đoạn mã trên. Và minh xin nhắc lại một lần nữa: điều này là hoàn toàn bình thường. Ta cần dùng vanilla vì nếu đoạn code trên nằm trong các thành phần của framework, nó sẽ không có hiệu lực cho đến khi hydration đã hoàn thành - nghĩa là đoạn mã trở nên vô dụng. Ta cũng không thiết lập các thuộc tính [defer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer), [async](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#async), hay biến đoạn mã thành [module](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#module) vì ta muốn nó chạy sớm nhất có thể, để bắt được chính xác hơn thời điểm hiệu ứng đã kết thúc (sự kiện `animationend`). Tiếp theo, ta lấy mốc thời gian khi hydration vừa hoàn thành và so sánh với mốc thời gian màn hình chờ đã có:

```svelte
/// filename=src/routes/+layout.svelte
<script>
  import { browser } from '$app/environment';

  if (browser) {
    const hydratedAt = new Date();
    const intervalId = setInterval(() => {
      splashedAt = document.documentElement.getAttribute('data-splashed-at');
      if (splashedAt) {
        clearInterval(intervalId);
        // :::highlight
        if (hydrated > new Date(splashedAt)) {
          // hydration hoàn thành sau khi màn hình chờ kết thúc
          // chỉ thị đường truyền không ổn định:
          // hiển thị thông báo phù hợp
        }
        // :::
      }
    }, 250);
  }
</script>
```

Bạn có thể đặt đoạn code trên ở nơi tùy ý - dù ở đâu đi nữa, miễn là thuộc trong phạm vi hydration, thì nó sẽ chỉ chạy khi hydration đã hoàn thành. Ngoài ra, về lý thuyết, ta có thể dùng [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) để theo dõi thay đổi của thuộc tính `data-splashed-at` thay vì `setInterval`, tuy nhiên làm như vậy đoạn code sẽ trở nên dài dòng và không cần thiết.

:::div c-callout c-callout--warning
Chú ý rằng bạn có thể sẽ phải điều chỉnh điều kiện so sánh hai mốc thời gian tùy thuộc vào số lượng tài nguyên mà trang cần tải, và độ dài của hiệu ứng trên màn hình chờ. Ví dụ, *sveltevietnam.dev* chỉ hiển thị thông báo khi hydration hoàn thành ***2 giây*** sau khi splash screen đã kết thúc. Bạn hãy thử thêm bớt một vài giây để tìm giá trị phù hợp nhất cho trang của mình nhé.
:::

Để giả lập tình huống đường truyên không ổn định, bạn có thể chọn "slow 3G" tại tùy chỉnh network tướng ứng trong devtool của trình duyệt.

## Mở rộng: hãy làm gì đó vui

Ít khi trong công việc ta có cơ hội thể hiện sự sáng tạo và phá cách như với màn hình chờ. Hãy thêm thắt hay làm gì đó thú vị cho cả người dùng và chính bạn. Nếu bạn đã ghé thăm *sveltevietnam.dev* nhiều lần (hoặc tải lại trang đủ lần), có thể bạn đã nhận ra rằng màn hình chờ ở đây có hai biến thể cho chuỗi hoạt ảnh, một biến thể ngắn thường gặp hơn (xác suất 75%), và một biến thể dài hơn (xác suất 25%). Bạn có thể trải nghiệm tại playground bên dưới (tính năng này cần Javascript). Hãy chọn biến thể bạn muốn và nhấn "chạy".

<SplashPlayground />

## Kết

Nhìn lại, ta đã hoàn thiện một màn hình chờ với những đặc điểm sau:

- dựa trên HTML, CSS,
- chỉ hiển thị lần đầu mà không bị lặp lại khi điều hướng,
- có thể hoạt động kể cả khi người dùng không sử dụng Javascript,
- khi có Javscript, có thể giúp phát hiện khi đường truyền ban đầu không ổn định.

Như vậy, ta có thể xem rằng màn hình chờ đã đạt những tiêu chí cơ bản của "cải thiện tăng dần" (tạm dịch từ "[progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)"). Đây là một khái niệm quan trọng khi thiết kế trải nghiệm người dùng mà mình khuyến khích bạn nên tìm hiểu thêm nếu chưa biết đến. Quá trình thiết lập màn hình chờ đã nhắc nhở cho mình rằng sử dụng vanilla HTML, CSS, và Javascript là hoàn toàn bình thường dù ta có đang dùng framework nào đi nữa. May mắn là, thiết kế của Svelte rất gần với nền tảng web tiêu chuẩn, và các tài liệu hay bài viết trong hệ sinh thái Svelte cũng không hề can ngăn chúng ta không sử dụng vanilla. Đó là một trong những lý do khiến mình cảm thấy tự nhiên và thoái mái khi sử dụng Svelte.

Hãy tham gia [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev) nếu bạn muốn thảo luận thêm về chủ đề này nhé. Xin cảm ơn!
