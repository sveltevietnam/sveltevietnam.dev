<script>
  import clickoutsideImage from '../images/clickoutside.png?format=webp&imagetools';
  import sveltePreprocessorImage from '../images/svelte-preprocessor.png?format=webp&imagetools';
  import preprocessBlogImage from '../images/preprocess-blog.png?format=webp&imagetools';
  import Example from '../examples/example.md.svelte';
</script>

<div class="c-callout c-callout--info">

Bài viết này bổ sung cho phiên chia sẻ **"Svelte, Javascript, và nền tảng Web"** tại sự kiện "[Gặp mặt Xuân Giáp Thìn 2024 - Hồ Chí Minh](/vi/su-kien/202404-gap-mat-xuan-giap-thin-ho-chi-minh)".

</div>

Svelte là một framework để xây dựng giao diện người dùng trên nền tảng web, so sánh được với React, Vue, Angular, ... Nếu bạn chưa từng nghe về Svelte hay sử dụng nó, mình khuyên bạn nên dành tí thời gian xem qua phần chia sẻ "[Rethinking Reactivity](https://www.youtube.com/watch?v=AdNJ3fydeao)" do [Rich Harris](https://twitter.com/rich_harris), tác giả của Svelte, trình bày. Video này sẽ cho bạn một cái nhìn tổng quát nhất về Svelte và điểm khác biệt nền tảng của nó so với các framework khác.

Trong bài viết này, mình sẽ giới thiệu hai ví dụ cụ thể, thông qua đó có thể phần nào giúp ta so sánh một số điểm khác biệt trong thiết kế API của Svelte so với những framework khác. Mình không có ý định thuyết phục bạn bỏ hết những framework bạn đang dùng và chuyển qua Svelte, nhưng hy vọng sau bài viết này, bạn sẽ đồng ý rằng Svelte là một công nghệ đáng để quan tâm.

## Web chính là framework

Hãy tưởng tương rằng bạn là một lập trình viên web chưa biết đến bất cứ framework nào, và nhiệm vụ của bạn là: bắt sự kiện click chuột xảy ra bên ngoài một phần tử:

<figure class="shrink-0">
  <img src={clickoutsideImage} class="mx-auto max-w-full rounded" width="400" height="176" alt="minh họa: khi nhấn vào vùng ngoài element, thể hiện bằng hình chữ nhật, một sự kiện clickoutside được phát ra" />
  <figcaption>Minh họa 1: sự kiện "clickoutside" - click chuột bên ngoài một phần tử</figcaption>
</figure>

Tính năng này có ứng dụng khá phổ biến. Hãy nhớ lại lần cuối bạn bắt gặp một cửa số thông báo hay hộp hội thoại tạm thời, khi nhấn vào bên ngoài nó, cửa số sẽ đóng lại: đó chính là "clickoutside". Vậy, bạn sẽ làm điều này với **vanilla Javascript** như thế nào? Dưới đây là một ví dụ đơn giản nhất:

```javascript title=clickoutside.js
export function clickoutside(node) {
  window.addEventLister('click', (event) => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  });
}
```

Chú ý rằng, ta phát ra một [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) với tên là `clickoutside` khi click chuột xảy ra ngoài phần tử `node`. `CustomEvent` là một web API tiêu chuẩn chứ không riêng của framework nào. Ví dụ trên cho phép ta tái sử dụng với bất cứ phần tử HTML nào:

```html title=my-page.html
<script type="module">
  import { clickoutside } from './clickoutside.js';

  // tham chiếu đến phần tử cần thiết
  const node = document.getElementById('my-element');

  // thiết lập sự kiện clickoutside
  clickoutside(node);

  // :::focus
  // thao tác khi clickoutside xảy ra
  node.addEventListner('clickoutside', () => { /* ... */ });
  // :::
</script>

<div id="my-element">...</div>
```

Khá đơn giản đúng ko nào. Vậy còn đối với framework yêu thích của bạn thì sao? Bạn sẽ thực hiện tính năng này như thế nào? Dưới đây là phiên bản tương ứng của `clickoutside` trong Svelte:

```svelte title=my-page.svelte
<script>
  import { clickoutside } from './clickoutside.js';

  const handleClickOutside = () => { /* ... */ };
</script>

<!-- :::focus -->
<div
  id="my-element"
  use:clickoutside
  on:clickoutside={handleClickOutside}
>...</div>
<!-- ::: -->
```

Khoan đã... `clickoutside.js` là gì? `clickoutside.js` ở đây cũng chính là phiên bản vanilla JS đã thấy trong ví dụ trước. Chú ý cú pháp `use:clickoutside`: hàm `clickoutside` của ta được sử dụng như một [Svelte action][svelte.action]. Khi sử dụng cú pháp này, Svelte sẽ tự động truyền vào action tham số `node` chính là phần tử HTML mà action được đặt lên. Cuối cùng, vì `node` được thiết lập để phát ra sự kiện `clickoutside`, ta chỉ cần gắn sự kiện `on:clickoutside` với hàm xử lý `handleClickOutside`.

### So sánh với Vue và React

Để so sánh một cách trực quan nhất, sau đây là `clickoutside` với mã nguồn được viết bằng Svelte từ thư viện [@svelte-put/clickoutside](https://svelte-put.vnphanquang.com/docs/clickoutside), React từ thư viện [usehooks-ts](https://usehooks-ts.com/react-hook/use-on-click-outside), và Vue từ thư viện [@vueuse](https://vueuse.org/core/onClickOutside).

<div class="c-callout c-callout--success c-callout--icon-bulb">

Thư viện [@svelte-put/clickoutside](https://svelte-put.vnphanquang.com/docs/clickoutside) là do mình viết ra, nếu tham khảo trang [documentation của thư viện](https://svelte-put.vnphanquang.com/docs/clickoutside), bạn sẽ thấy rằng nó cung cấp nhiều tính năng hơn các phiên bản còn lại, với số lượng dòng code tương đương.

</div>

<enhanced-code-block group display="tabs">

```javascript title=Svelte src="../examples/clickoutside.svelte.txt"
```

```typescript title=React src="../examples/clickoutside.react.txt"
```

```typescript title=Vue src="../examples/clickoutside.vue.txt"
```

</enhanced-code-block>

Chú ý rằng phiên bản Svelte là hoàn toàn độc lập, trong khi Vue và React có sử dụng thêm code từ các tệp khác được nhập (import) vào. Về mặc cú pháp, mình sẽ để bạn tự quyết định rằng cái nào phù hợp hơn với phong cách của bạn. Nhưng hy vọng chúng ta đều có thể đồng ý với quan sát sau đây:

> `clickoutside` viết bằng Svelte là vanilla Javascript, nó không phụ thuộc vào bất cứ API nào từ Svelte. Thay vào đó, React và Vue đòi hỏi một lớp abstraction để có thể hoạt động được trong ngữ cảnh của framework.

Vì sao điều này quan trọng? Svelte gỡ bỏ abstraction và giúp ta tiếp cận gần hơn với các cộng nghệ nền tảng, cụ thể là HTML, CSS, Javascript, và các web API tiêu chuẩn. Một lập trình viên mới, nếu có kiến thức nền tảng về web, sẽ dễ dàng tiếp cận và sử dụng Svelte. Một ngày nào đó, khi Svelte không còn nữa (và ngày đó sẽ đến), những kiến thức này sẽ vẫn còn giá trị, vì nó là kiến thức về web, chứ không phải là kiến thức đặc hữu của riêng Svelte.

Nói cách khác, trong ví dụ này, Svelte không đóng vai trò gì to tát lắm, nền tảng web mới chính là framework mà ta cần quan tâm.

## Compiler chính là framework

Điểm khác biệt lớn nhất của Svelte là cách nó sử dụng trình biên dịch (compiler) để phân tích mã nguồn tại thời gian biên dịch (compile time) nhằm giảm thiểu mã nguồn tại thời gian trang web hoạt động trong browser (runtime). Svelte không sử dụng virtual DOM như React hay Vue mà đưa mô hình reactivity vào ngay lúc biên dịch. Nếu những gì mình vừa nói nghe lạ lẫm, bạn có thể nhìn một cách tóm tắt như sau:

> Svelte thay ta tối ưu hóa mã nguồn trước khi nó được chạy ở máy của người dùng cuối. Kết quả thường thấy là một trang web nhẹ và nhanh hơn!

Tuy nhiên, trong bài viết này, ta sẽ không tập trung vào khía cạnh tối ưu hóa này, mà là việc Svelte cho phép ta mở rộng trình biên dịch để tạo ra những tính năng tùy biến, thông qua một API gọi là [Svelte Preprocessor][svelte.preprocess]. Nói ngắn gọn, Svelte preprocessor là một hàm số nhận vào mã nguồn Svelte, và trả về một mã nguồn Svelte mới, với thay đổi tùy ý miễn là tại cuối chu trình biên dịch, mã nguồn vẫn hợp lệ với những gì Svelte cho phép.

<figure class="shrink-0">
  <img src={sveltePreprocessorImage} class="mx-auto max-w-full rounded" width="800" height="255" alt="minh họa: bên trái thể hiện mã nguồn với thẻ fire trong nội dung, sau khi biến đổi thông qua preprocessor, bên phải thể hiện mã nguồn với thẻ fire được thay đổi thành emoji ngọn lửa" />
  <figcaption>Minh họa 2: một Svelte preprocessor biến thẻ "fire" thành emoji tương ứng</figcaption>
</figure>

Nhiệm vụ lần này của ta là: thiết lập một trang blog tĩnh viết bằng markdown, tượng tự như trang *sveltevietnam.dev* mà bạn đang đọc. Cụ thể hơn, làm sao để biến đoạn mã markdown dưới đây:

```javascript enhanced=false src=../examples/example.md.svelte
```

thành giao diện:

<Example />

Để làm được điều này, mã nguồn sẽ phải đi qua một chuỗi xử lý tương đối phức tạp:

<figure class="shrink-0">
  <img src={preprocessBlogImage} class="mx-auto max-w-full rounded" width="800" height="530" alt="minh họa: chuỗi xử lý MDSvex, ShikiJS, enhance-code-block, và vite để biến markdown thành html giao diện phù hợp" />
  <figcaption>Minh họa 3: quá trình biến đổi mã nguồn markdown thành giao diện hoàn chỉnh trên trang blog</figcaption>
</figure>

1. Sử dụng Svelte preprocessor [MDSvex] để biến đổi markdown thành Svelte component tương ứng.
2. Sử dụng [Shiki] để cung cấp [syntax highlighting](https://en.wikipedia.org/wiki/Syntax_highlighting) cho mã nguồn.
3. Sử dụng Svelte preprocessor `enhanced-code-block` (một preprocessor do mình viết) để cung cấp thêm các tính năng như số dòng code, tiêu đề, nút sao chép, mở rộng màn hình, thu gọn.
4. Thông qua [Vite] làm build tool để thể hiện thành html cuối cùng, như trang mà bạn đang đọc.

<div class="c-callout c-callout--success c-callout--icon-bulb">

Điều quan trọng mà ta cần chú ý là: toàn bộ quy trình biến đổi trên được thực hiện tại thời gian biên dịch và thời gian build ra trang web cuối cùng. Có nghĩa là, ta không cần phải tải mã nguồn Svelte preprocessor hay Shiki lên trình duyệt của người dùng cuối. Kết hợp điều vừa rồi với một số kỹ thuật [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement), hơn 90% nội dung bài viết và các tính năng trên trang đều hoạt động mà không cần Javascript.

</div>

Mình sẽ không đi sâu vào chi tiết thực hiện của các Svelte preprocessor đã nêu trong bài viết này. Nếu bạn có hứng thú, hãy tham khảo [svelte.config.js](https://github.com/sveltevietnam/sveltevietnam.dev/blob/01ff00046e890f7098f6e8725eba93d88764ce2b/sites/www/svelte.config.js) - nơi khai báo tất cả các preprocessor giúp xây dựng lên trang Blog của Svelte Việt Nam.

Nhờ có Svelte preprocessor API, công việc trên không chỉ trở nên khả thi, mà còn tương đối dễ dàng, thậm chí là với một lập trình viên có kinh nghiệm trung bình như mình. Nếu yêu cầu phải thực hiện việc tương tự bằng một framework khác, mình không chắc rằng mình có thể tự tin đảm nhận công việc này, hay thậm chí là nó có khả thi hay không.

## Chẳng ai quan tâm

Thật ra, chẳng ai thật sự quan tâm đến việc framework này nọ như thế nào. Chúng ta chỉ muốn phát triển ứng dụng một cách hiệu quả nhất, dễ bảo trí nhất, và mang lại trải nghiệm tốt nhất cho người dùng. May mắn là, những người tạo ra Svelte hiểu điều này. Trong bài viết "[Tenets](https://github.com/sveltejs/svelte/discussions/10085)" (tạm dịch: "Các nguyên tắc"), Rich Harris giải thích rằng: Svelte không cố gắng trở thành framework nhanh nhất, nhẹ nhất, nhiều người dùng nhất, hay đạt điểm cao nhất trong các benchmark hay đánh giá của Lighthouse, mà hướng đến trở thành framework truyền cảm nhất (từ gốc: "best vibes").

Sau hai ví dụ trên, ta quan sát được rằng: nếu bạn hiểu về HTML, CSS, và Javascript, bạn có thể sử dụng Svelte. Tương tự, nếu bạn có kiến thức về khoa học máy tính, về lập trình, bạn có thể mở rộng Svelte để phục vụ cho nhu cầu của bạn, giải quyết những vấn đề ngay cả những người tao ra Svelte cũng không biết đến. Tất cả mọi thứ đều quay trở lại những nền tảng cơ bản - những kiến thức bạn thật sự cần có để tạo ra một ứng dụng web tốt nhất cho người dùng.

Vì vậy, thật sự là, bạn không cần phải quan tâm đến Svelte vì nó là một framework đột phá, xuất sắc nhất, sẽ thay thế tất cả mọi công nghệ như các bài viết trên mạng xã hội thường quảng cáo. Hãy quan tâm đến Svelte vì nó là phương tiện giúp bạn tiếp cận web một cách thật sự dễ dàng.

[svelte.action]: https://svelte.dev/docs/svelte-action
[svelte.preprocess]: https://svelte.dev/docs/svelte-compiler#preprocess
[mdsvex]: https://github.com/pngwn/MDsveX
[shiki]: https://shiki.style/
[vite]: https://vitejs.dev/
