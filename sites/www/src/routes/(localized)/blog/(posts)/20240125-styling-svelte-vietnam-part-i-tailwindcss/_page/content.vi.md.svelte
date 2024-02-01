<script>
	import tailwindHateImage from './images/tailwind-hate-vi.png?format=webp&imagetools';
	import tailwindInPostCSSImage from './images/tailwind-in-postcss-vi.png?format=webp&imagetools';
	import tailwindContentImage from './images/tailwind-content.png?format=webp&imagetools';
</script>

Bài viết "Styling cho Svelte Việt Nam" được chia làm ba phần, liệt kê sau đây. Bạn đang đọc phần đầu tiên.

<div class="not-prose ml-6">
  <ul class="divider-border mt-3 max-w-[548px] divide-y">
    <li>
      <a href="/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-i-tailwindcss" class="c-link c-link--box font-medium">
        <span><strong>Phần I - TailwindCSS</strong></span>
      </a>
    </li>
    <li>
      <a href="/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-ii-css-components" class="c-link c-link--box">
        <span>Phần II - CSS Component</span>
      </a>
    </li>
    <li>
      <a href="/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-iii-kham-pha-va-tai-su-dung-ma-nguon" class="c-link c-link--box">
        <span>Phần III - Khám phá và tái sử dụng mã nguồn</span>
      </a>
    </li>
  </ul>
</div>

Bên cạnh đó, bài viết cũng nằm cũng trong chuỗi bài viết "Behind the Screen", nơi mình chia sẻ những kinh nghiệm và bài học trong quá trình xây dựng *sveltevietnam.dev*. Bạn có thể tìm đọc phần trước tại "[Màn hình chờ với nâng cao tăng dần](/en/blog/20231220-behind-the-screen-progressive-splashscreen)".

---

Trong phần này, chúng ta bàn luận đến một số ý kiến về [TailwindCSS](https://tailwindcss.com/), các cách tiếp cận phổ biến khi sử dụng Tailwind cũng như các kỹ thuật và lưu ý được nhắc đến ít hơn. Thông qua đó, mình hy vọng có thể thuyết phục bạn rằng Tailwind là một công cụ linh hoạt và giúp bạn hiểu thêm lý do mình lựa chọn nó trong quá trình xây dựng *sveltevietnam.dev*.

## Tranh cãi về TailwindCSS

Gần đây, Tailwind đã trở thành một từ khóa và chủ đề nhạy cảm dễ gây nên xung đột từ nhiều ý kiến trái chiều. Có người rất thích Tailwind và sẽ đưa ra mọi luận điểm để bảo vệ nó, còn một số người khác sẽ khẳng định với bạn rằng Tailwind là một giải pháp tệ hại và cần tránh xa. Thử tìm từ khóa "Tailwind thích và ghét" từ Google hay Twitter là bạn có thể đọc được ngay 1001 tranh luận nảy lửa. Nhìn chung, người ta thích Tailwind ở tính tiện lợi, nhanh chóng, dễ dàng tích hợp với các công cụ và hệ sinh thái đã có; và người ta ghét Tailwind xoay quanh việc đặt nhiều lớp vào các thẻ HTML thay vì viết CSS trong tệp riêng.

<figure>
  <img src={tailwindHateImage} class="mx-auto max-w-full rounded" width="620" height="385" alt="minh họa: tranh cãi về TailwindCSS - người này ghét Tailwind, người kia ghét người này" />
  <figcaption>Minh họa 1: tóm tắt thảo luận trên Twitter về TailwindCSS</figcaption>
</figure>

Đây là luận điểm mình hay chia sẻ mỗi lần được hỏi về chủ đề này: "ý tưởng Tailwind" **không** hề mới! Việc sử dụng lớp `mx-4` thay vì viết `margin-left: 16px; margin-right: 16px` đã tồn tại hơn một thập kỉ nay trong các thư viện CSS, tiêu biểu là [Bootstrap](https://getbootstrap.com/). Nếu bạn đã từng làm việc trong một hệ thống thiết kế lớn, khả năng cao bạn cũng đã bắt gặp hoặc tự phải thiết lập những abstraction tương tự.

<figure>
  {@html `<iframe width="560" height="315" src="https://www.youtube.com/embed/t-eR4hA7obg?si=1pIas2MNVjSd-SMF&amp;clip=UgkxC3P7k2e36xkOwf4m1xw7D1M3xApNvZ-d&amp;clipt=EPrhBRiVlAc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`}
  <figcaption>Video 1: ThePrimeagen nói về hệ thống anh đã làm ra hơn một thập kỉ trước</figcaption>
</figure>

Điểm khác biệt lớn nhất của Tailwind so với các giải pháp tương tự trước đây là:

1. tập trung vào chức năng - cung cấp các lớp nền tảng đối chiếu trực tiếp với CSS - chứ không tạo ra các thành phần giao diện phức tạp. Ví dụ, Tailwind sẽ dừng lại ở `.ml-4` thay vì `.accordion` hay `.btn-primary`,
2. xây dựng trên nền [PostCSS](https://postcss.org/), cung cấp API để tùy chỉnh, và hỗ trợ nâng cao năng suất của lập trình viên thông qua [language server](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/3a465543cb7aa36c258dbe094a5a2927877229b1/packages/tailwindcss-language-server) để tích hợp với các trình soạn thảo mã nguồn.

Như vậy, Tailwind đối với mình là một công cụ tốt, và nếu sử dụng đúng cách có thể giúp ta cải thiện năng suất mà không đánh đổi chất lượng của mã nguồn.

## Tailwind để prototype nhanh

Trong quá trình xây dựng [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) hay thử nghiệm ý tưởng, một trong những ưu tiên hàng đầu là tốc độ. Tailwind là giải pháp phù hợp cho giai đoạn này vì nó giúp ta gói gọn style ngay bên cạnh markup, dễ dàng thiết lập, tìm kiếm, và thay đổi. Thay vì bỏ thời gian thiết kế cấu trúc dự án phức tạp hay quy ước đặt tên cồng kềnh như [BEM](https://getbem.com/)...

```svelte
<!-- BEM markup & styling -->
<prototype>
  <block class="block">
    <element class="block__element block__element--modifer">
      nội dung chắc chắn sẽ được tái cấu trúc về sau
    </element>
  </block>
</prototype>

<style lang="postcss">
.block {
  & .block__element {
    &.block__element--modifier {
      /* prototype styling */
    }
  }
}
</style>
```

...ta có thể sử dụng những lớp có sẵn của Tailwind mà đa số lập trình viên đều biết đến hoặc dễ dàng làm quen:

```svelte
<!-- Tailwind -->
<prototype>
  <block class="flex items-center mx-auto">
    <element class="py-4">
      this will definitely be refactored
    </element>
  </block>
</prototype>
```

Một dự án với mã "đẹp", cấu trúc hoành tráng, quy ước nghiêm ngặt mà không có người dùng thì cũng không có ý nghĩa gì phải không nào. Thay vì tranh luận nên đặt tên block, element như thế nào, hay phải đối chiếu giữa markup và vị trí tương ứng trong CSS, ta có thể dành thời gian tiết kiệm được để tập trung phát triển sản phẩm. Tuy nhiên, đây không đồng nghĩa là thoái mái viết mã một cách bữa bãi. Vì Tailwind là một lớp abstraction đơn giản, ta có thể dễ dàng tái cấu trúc (refactor) hoặc phát triển lên quy mô lớn (scale up), đặc biệt là tại thời điểm các chi tiết thiết kế và đặc tính giao diện đã xuất hiện một cách rõ ràng qua quá trình lớn lên của dự án, như ta sẽ thấy dưới đây.

## Tailwind để tạo hệ thống thiết kế

Khi dự án đã trưởng thành, sẽ đến lúc ta cần thiết lập hệ thống bảng màu, font chữ, khoảng cách, ... Tailwind giúp việc này dễ dàng bằng cách để người dùng cung cấp [cấu hình tùy chỉnh](https://tailwindcss.com/docs/configuration) trên hầu hết mọi phương diện. Trong ví dụ theo đây, ta khai báo thêm font chữ "Inter" và màu chủ đạo.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
  theme: {
    // :::highlight
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: 'hsl(10 100% 54%)',
      },
    },
    // :::
  },
};
```

Những giá trị trong thiết kế được gọi chung là "design token" và như bạn thấy ở trên, chúng được khai báo bằng Javascript, có nghĩa là ta có thể làm bất cứ gì mà Javascript cho phép: map, filter, biến đổi màu sắc, sử dụng API từ Tailwind hay thư viện thứ ba, ... Bằng cách cấu hình trên, ta mặc nhiên có sẵn ba phương thức sử dụng:

1. sử dụng lớp tương ứng trực tiếp trong HTML, ví dụ:

    ```svelte
    <element class="font-inter text-primary"></element>
    ```

2. truy cập trong CSS bằng hàm [theme(...)](https://tailwindcss.com/docs/functions-and-directives#theme) từ Tailwind:

    ```css
    element {
      color: theme('colors.primary');
      font-family: theme('fontFamily.inter');
    }
    ```

3. truy cập từ chính Javascript. Ví dụ, ta có thể khai báo bảng màu bằng trong một tệp riêng và sử dụng mọi nơi thích hợp. Đây là cách *sveltevietnam.dev* cấu trúc bảng màu; bạn có thể đọc [mã nguồn tại đây](https://github.com/sveltevietnam/sveltevietnam.dev/blob/dec07ae0cbabfd6a1ca363b879ae3dece75c3780/libs/ui/css/colors/colors.js).

    ```javascript
    // colors.js
    export const colors = {
      primary: 'hsl(10 100% 54%)',
      // ...
    };
    ```

Tất cả dự án có sử dụng Tailwind mà mình đã tham gia đều cần thiết lập tùy chỉnh tương tự như trên, để phù hợp với thiết kế riêng của ứng dụng. Nếu bạn đã từng làm việc cho hệ thống lớn áp dụng các giải pháp đóng gói và tái sử dụng CSS, tiêu biểu như [Sass](https://sass-lang.com/), thiết lập hệ thống thiết kế là một công việc nặng nề và rất mất thời gian. Để có thể đạt được tính linh hoạt như Tailwind, có lẽ bạn đã có nhiều năm kinh nghiệm và thậm chí là đã phát triển một framework của riêng bạn mất rồi! Có rất nhiều hệ thống giao diện ra đời gần đây tích hợp Tawilwind hoặc khuyến khích sử dụng nó, ví dụ như [daisyUI](https://daisyui.com/), [Flowbite](https://flowbite.com/docs/getting-started/introduction/), [Skeleton](https://www.skeleton.dev/), [shadcn/ui](https://www.shadcn-svelte.com/).

## Đừng phục vụ Tailwind. Hãy để Tailwind phục vụ bạn.

Hãy bàn về luận điểm cho rằng Tailwind "khiến" ta phải thêm quá nhiều lớp vào markup, làm cho việc đọc hay bảo trì khó hơn; hay là Tailwind khiến ta không còn viết vanilla CSS được nữa. Mình nghĩ rằng trong những tình huống này, ta vô tình đang phục vụ Tailwind: ta xem nó như một framework và cách tiếp cận của nó là độc nhất. Thay vì như vậy, hãy nhìn rộng hơn và xem Tailwind như một công cụ trong hệ sinh thái CSS. Thay vì chỉ sử dụng Tailwind, hãy dùng nó khi cần, khi bạn thấy phù hợp; tương tự, hãy cứ viết CSS, dùng PostCSS khi nhu cầu cho phép.

:::div c-callout c-callout--warning
Đừng học hay dạy CSS thông qua Tailwind: đó là một hướng tiếp cận rất nguy hiểm. Nếu bạn mới bắt đầu học CSS, hãy bắt đầu từ CSS truyền thống. Khi giải quyết vấn đề thực tế, ta không bắt đầu từ tư duy "làm cái này bằng Tailwind như thế nào?" mà luôn bắt đầu từ "giải quyết cái này bằng CSS ra sao?", sau đó mới xem xét Tailwind có cung cấp công cụ tương ứng hay không.
:::

Ví dụ, thay vì bỏ hết vào markup...

```svelte
<form class="py-4">
  <p>...</p>
  :::highlight
  <button class="mt-4 px-4 py-2 text-center font-semibold rounded-md bg-white hover:bg-black hover:text-white">
  :::
    Button
  </button>
</form>
```

...bạn có thể sử dụng Tailwind để truy cập vào hệ thống thiết kế trong CSS để gói gọn những thành phần phức tạp...

```css
@layer components {
  .c-btn {
    padding: theme('spacing.2') theme('spacing.4');
    text-align: center;
    font-weight: theme('fontWeight.semibold');
    border-radius: theme('borderRadius.md');
    background-color: theme('colors.white');

    &:hover {
      background-color: theme('colors.black');
      color: theme('colors.white');
    }
  }
}
```

...và chỉ sử dụng các lớp từ Tailwind cho quan hệ khoảng cách giữa các thành phần trong trang

```svelte
:::diff -
<button class="mt-4 px-4 py-2 text-center font-semibold rounded-md bg-white hover:bg-black hover:text-white">
:::
:::diff +
<button class="mt-4 c-btn">
:::
  Button
</button>
```

## Tailwind cùng PostCSS

Trên một phương diện nào đó, ta có thể xem Tailwind đơn thuần như một [plugin PostCSS](https://postcss.org/docs/postcss-plugins). Điều này có nghĩa là ta có thể sử dụng Tailwind cùng với các plugin khác, và ngược lại tận dụng các API từ PostCSS để mở rộng cấu hình Tailwind.

<figure>
  <img src={tailwindInPostCSSImage} class="mx-auto max-w-full rounded" width="800" height="385" alt="minh họa: Tailwind trong hệ sinh thái PostCSS giúp nâng cao CSS" />
  <figcaption>Minh họa 2: Tailwind trong hệ sinh thái PostCSS giúp nâng cao CSS</figcaption>
</figure>

Trong bài viết "[Giao diện tối (dark mode) với SvelteKit, PostCSS, và TailwindCSS](/vi/blog/20231110-behind-the-screen-giao-dien-toi-voi-sveltekit-postcss-va-tailwindcss)", mình có giới thiệu về hai cú pháp đặc biệt, hỗ trợ cho việc thiết lập chế độ tối. Cú pháp đầu tiên mở rộng CSS:

```css
p {
  @dark {
    color: white;
  }
}
```

Cú pháp thứ hai mở rộng Tailwind và được sử dụng trong markup:

```svelte
<p class="dark:text-white">...</p>
```

Hai cú pháp trên mang giá trị như nhau, cho ra cùng một kết quả, và cùng đến từ một plugin PostCSS mà mình tự viết [postcss-color-scheme](https://github.com/vnphanquang/postcss-color-scheme). Nhờ sự tương thích của Tailwind với PostCSS mà ta có thể làm được điều này, cung cấp hai giải pháp cho lập trình viên tùy biến theo hoàn cảnh của công việc. Nếu đến mình còn viết được một plugin thế này, thì mình dám chắc là bạn cũng có thể làm điều tương tự, thậm chí còn tốt hơn!

## Tailwind trong Svelte

Tailwind có cung cấp [hướng dẫn thiết lập cụ thể cho SvelteKit](https://tailwindcss.com/docs/guides/sveltekit). Sử dụng Tailwind trong Svelte không khác biệt mấy so với các framework khác, những kỹ thuật đã được nhắc đến ở các phần trước đều có thể áp dụng được. Tuy nhiên, bạn nên cẩn trọng khi sử dụng cú pháp [@apply](https://tailwindcss.com/docs/functions-and-directives#apply). Cú pháp này giúp ta áp dụng các lớp của Tailwind vào CSS. Ví dụ, với tệp sau:

```css
/* input.css */
.btn {
  @apply font-bold py-2 rounded;
  padding-inline: 16px;
}
```

Kết quả sau khi biên dịch sẽ là:

```css
/* output.css */
.btn {
  font-weight: 800;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 0.25rem;
  padding-inline: 16px;
}
```

:::div c-callout c-callout--warning
Nhìn chung, mình không khuyến khích sử dụng cú pháp `@apply`. Như bạn thấy ở ví dụ trên, tính năng này tuy rất nhanh gọn nhưng lại trộn lẫn hai cú pháp khác biệt, đem lớp HTML vào CSS. Nếu bị lạm dụng, điều này khiến việc bảo trì và tối ưu khó khăn hơn. Ta thường dùng `@apply` để đóng gói một đoạn mã CSS cho việc tái sử dụng, nhưng điều này hoàn toàn có thể thực hiện bằng cách mở rộng cấu hình của Tailwind; ta sẽ đi sâu hơn về phương pháp này trong các phần sau của bài viết.
:::

Ngoài ra, sử dụng `@apply` trong các tệp `*.svelte` cũng là điều nên tránh vì hai nguyên nhân. Một là đôi khi nó sẽ không hoạt động như mọng đợi, như đã [đề cập ở đây từ tài liệu của Tailwind](https://tailwindcss.com/docs/functions-and-directives#using-apply-with-per-component-css). Thứ hai là, kết quả biên dịch có thể bị ô nhiễm bởi các lớp không cần thiết. Để hiểu được ý này, hãy đi qua một cách tổng quát nhất về cách hoạt động của Tailwind.

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
};
```

Trong cấu hình của Tailwind có một thuộc tính bắt buộc là `content`. Trình biên dịch của Tailwind ([Just-In-Time Compiler](https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css)) sẽ đọc các tệp khai báo tại `content`, tìm các lớp khả dụng (`mx-auto`, `pl-2`, `rounded`, ...) và tạo ra CSS tương ứng. Giả sử ta có tệp Svelte:

```svelte
<!-- example.svelte -->
<article>...</article>

<style lang="postcss">
  article {
    /* :::highlight */
    @apply rounded;
    /* ::: */
  }
</style>
```

Kết quả biên dịch của cả quy trình (SvelteKit + Tailwind) trông như sau:

```css
/* example.css */
article.svelte-hash {
  border-radius: 0.25rem;
}
:::highlight warning
.rounded {
  border-radius: 0.25rem;
}
:::
```

Như bạn thấy, đoạn mã đánh dấu màu vàng ở trên là không cần thiết. Ta không sử dụng lớp `rounded` ở đâu trong markup cả, nhưng vì từ khóa "rounded" trong *example.svelte* thuộc phạm vi tìm kiếm đã khai báo từ `content`, Tailwind mặc định rằng nó là cần thiết trong CSS đầu ra.

<figure>
  <img src={tailwindContentImage} class="mx-auto max-w-full rounded" width="800" height="316" alt="minh họa: Tailwind tìm kiếm từ khóa từ các tệp theo cấu hình content" />
  <figcaption>Minh họa 3: Tailwind tìm kiếm từ khóa từ các tệp theo cấu hình `content`</figcaption>
</figure>

:::div c-callout c-callout--success
Trong các tình huống cần tối ưu hóa tốc độ và dung lượng đầu ra, hiểu được điều này sẽ giúp bạn rất nhiều. Ví dụ khi dùng [daisyUI](https://daisyui.com), các từ khóa thư viện này khai báo là rất phổ biến như `card`, `dropdown`, `table`. Chỉ cần mã nguồn có chứa từ khóa thì trong đầu ra sẽ có CSS tương ứng, dù bạn có thật sự sử dụng hay không. Đó là lý do Tailwind và daisyUI cung cấp [cấu hình prefix](https://daisyui.com/docs/config/#prefix), giúp biến đổi từ khóa khó bị nhầm lẫn hơn, ví dụ như `daisy-card`, `daisy-dropdown`, `daisy-table`, ...
:::

Tóm lại, khi dùng Tailwind nên tránh sử dụng `@apply`, và nếu cần thiết, chỉ dùng nó trong các tệp `*css` để tránh thiết lập phức tạp hay ô nhiễm kết quả biên dịch.

## Tạm kết

Hãy tạm gác lại bài viết tại đây vì đã dài rồi. Tổng kết, bản thân mình không có lý do gì để ghét một công cụ đem lại sự tiện lợi đột phá như Tailwind. Những tư duy trên là nền tảng giúp xây dựng hệ thống thiết kế và cách sử dụng CSS tại *sveltevietnam.dev* mà mình sẽ làm rõ hơn trong hai phần tiếp tới của bài viết "Styling cho Svelte Việt Nam".

Hãy tham gia [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev) để thảo luận thêm về bài viết, hoặc đọc tiếp phần hai tại "[Styling cho Svelte Việt Nam: phần II - CSS Component](/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-ii-css-components)". Xin cảm ơn!
