Hiển thị icon là một vấn đề hiện hữu trong mọi dự án web mà mình đã từng tham gia.
Trong quá trình phát triển trang sveltevietnam.dev qua ba năm vừa rồi, mình đã thử nghiệm một số
giải pháp khác nhau nhưng đều chưa thỏa mãn hoàn toàn nhu cầu.

Với một số phát triển gần đây trong hệ sinh thái web, và nhân cơ hội hoàn thiện phiên bản V1 của
trang sveltevietnam.dev, mình đã quyết định sử dụng [Iconify] kết hợp với [Tailwind V4](tailwind)
để cải thiện hiệu suất trong việc quản lý icon. Bên cạnh đó, mình cũng dùng [@svelte-put/inline-svg]
cho một số trường hợp cần thiết phải sử dụng trực tiếp SVG.

## TL;DR - cho người vội vã

Cho icon tĩnh, sử dụng Iconify với Tailwind V4:

```bash
pnpm add -D @iconify-json/your-icon-set @iconify/tailwind4
```

```css title="Iconify + Tailwind V4"
@plugin '@iconify/tailwind4' {
	prefix: i;
	/* stylelint-disable-next-line property-no-unknown, order/properties-order  */
	override-only: true;
}

@utility i {
	@layer components {
		display: inline-block;

		width: 1em;
		height: 1em;

		color: inherit;
		vertical-align: text-bottom;

		background-color: currentcolor;

		mask-image: var(--svg);
		mask-repeat: no-repeat;
		mask-size: 100% 100%;
	}
}
```

Cho các trường hợp còn lại, sử dụng [@svelte-put/inline-svg].

## Chiến lược hiển thị icon tĩnh

### CSS Icon

Có rất nhiều cách để hiển thị icon như icon font (ví dụ như [Font Awesome](https://fontawesome.com/)),
sử dụng trực tiếp file SVG hoặc qua thẻ `<img>`. Giải pháp mình giới thiệu trong bài viết này sử dụng
CSS và hiển thị icon thông qua [mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image)
(hoặc [background-image](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image) trong một số trường hợp).

Đây là CSS nền tảng cho icon được hiển thị tại sveltevietnam.dev:

```css title="CSS icon"
.i {
  display: inline-block;

  width: 1em;
  height: 1em;

  color: inherit;
  vertical-align: text-bottom;

  background-color: currentcolor;

  /* :::highlight */
  mask-image: var(--svg);
  /* ::: */
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
```

Mình sẽ không giải thích nhiều về giải pháp này. Bạn có thể tham khảo bài viết
["Icons in Pure CSS"](https://antfu.me/posts/icons-in-pure-css) của [Anthony Fu](https://github.com/antfu)
đề có cái nhìn chi tiết hơn.

### SVG trong CSS

Trong đoạn mã trên, ta hãy tập trung vào dòng:

```css
  mask-image: var(--svg);
```

Biến `--svg` là nơi mà ta cần thay thế tùy hoàn cảnh để hiển thị icon mong muốn:

```css title="SVG-trong-CSS"
.i-\[identifier\] {
  --svg: url("data:image/svg+xml,encoded-svg");
}
```

Trong đó, `identifier` là tên của icon, và `encoded-svg` là văn bản mã hóa của SVG cần hiển thị
(ví dụ như thông qua hàm [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)).

Về lý thuyết, ta cỏ thể tải bất cứ tài nguyên hình ảnh nào thông qua `url(...)`. Tuy nhiên, đối với
icon, người ta thường nhúng SVG trực tiếp vào CSS vì một vài nguyên nhân sau đây:

1. SVG icon thường được tối ưu hóa để có kích thước nhỏ, nên sẽ không ảnh hưởng quá nhiều đến của đầu ra CSS.
2. Sử dung SVG thay vì các [định dạng raster](https://vi.wikipedia.org/wiki/%C4%90%E1%BB%93_h%E1%BB%8Da_raster)
   để icon có thể thay đổi kích thước tùy nhu cầu.
3. Icon thường chiếm vai trò quan trọng hơn trong giao diện so với các hình ảnh khác, vì vậy cần được
   hiển thị nhanh chóng. Nếu ta tải `url(...)` từ một tệp riêng biệt, ví dụ `/icons/link.svg`,
   trình duyệt có thể sẽ trì hoãn việc tải tài nguyên này, dẫn đến một độ trễ nhất định trước khi icon
   được hiển thị trên trang.

   Vì CSS được xử lý đồng bộ (sync), khi nhúng trực tiếp SVG, icon sẽ được hiển thị ngay lập tức.

### Kết hợp

Tóm lại, để hiển thị một icon, ta cần áp dụng hai lớp trên vào HTML:

```html
<i class="i i--[identifier]"></i>
```

## Quản lý icon

### Iconify

Vai trò của Iconify trong giải pháp này là cung cấp kho icon SVG để ta thay thế biến `--svg`
như đã trình bày ở trên. [Iconify] là một thư viện mã nguồn mở, tập hợp rất nhiều bộ icon phổ biến.
Tại sveltevietnam.dev, mình chỉ cần cài đặt các gói tương ứng để sử dụng hai bộ icon
[Phosphor](https://phosphoricons.com/) và [Simple Icons](https://simpleicons.org/):

```bash
pnpm add -D @iconify-json/ph @iconify-json/simple-icons
```

Ví dụ, để hiển thị icon <i class="i i-[ph--cpu] h-5 w-5"></i> từ bộ Phosphor, mình sẽ sử dụng đoạn mã sau:

```html
<i class="i i-[ph--cpu]"></i>
```

hoặc hiển thị icon <i class="i i-[simple-icons--svelte] h-5 w-5"></i> từ bộ Simple Icons:

```html
<i class="i i-[simple-icons--svelte]"></i>
```

### Tailwind

Vai trò của Tailwind là giúp ta không phải viết thủ công CSS cho từng icon mà sẽ tự động build ra
CSS đựa trên các icon **được sử dụng** trong dự án.
Trong hai ví dụ ở phần trước, `i-[ph--link]` và `i-[simple-icons--svelte]`
sẽ được Tailwind tự động phát hiện và thêm vào CSS đầu ra:

```css title="CSS đầu ra"
.i-\[ph--link\] { --svg: url("data:image/svg+xml,...") }
.i-\[simple-icons--svelte\] { --svg: url("data:image/svg+xml,...") }
```

Để tích hợp Iconify với Tailwind, ta cần cài đặt thêm gói sau:

```bash
pnpm add -D @iconify/tailwind4
```

<div class="c-callout c-callout--info">

Chú ý rằng mình sử dụng phiên bản Tailwind V4 trong bài viết này. Nếu bạn dùng các phiên bản cũ hơn
hãy tham khảo thêm [tài liệu của Iconify](https://iconify.design/docs/usage/css/tailwind/) nhé.

</div>

Tiếp theo, ta cần thêm cấu hình sau cho CSS đầu vào — bất cứ mã nguồn nào được xử lý bởi Tailwind,
thường là tệp `app.css` hoặc `global.css` nơi bạn sử dụng `@import 'tailwindcss'`:

```css title="Cấu hình Iconify cho Tailwind"
@plugin '@iconify/tailwind4' {
	prefix: i;
	/* stylelint-disable-next-line property-no-unknown, order/properties-order  */
	override-only: true;
}
```

Nếu bạn không dùng [Stylelint](https://stylelint.io/), có thể bỏ qua dòng `stylelint-disable-next-line`. Có nhiều cách
cấu hình khác nhau tùy vào nhu cầu và sở thích, bạn có thể
[tham khảo thêm tài liệu này](https://iconify.design/docs/usage/css/tailwind/tailwind4/).

### Tùy chỉnh kích thước và màu sắc

Di chuyển khai báo `.i` trình bày ở phần ["CSS Icon"](#css-icon) đến đầu vào CSS:

```css title="utility"
/* :::diff - */
.i {
/* ::: */
/* :::diff + */
@utility i {
  @layer components {
/* ::: */
    display: inline-block;
    /* ... giản lược ... */
    mask-image: var(--svg);
    /* :::diff + */
  }
  /* ::: */
}
```

[@utility](https://tailwindcss.com/docs/functions-and-directives#utility-directive) là chỉ thị của
Tailwind để định nghĩa lớp utility. Bên cạnh đó `@layer components` giúp ứng dụng
[CSS layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) để dễ dàng tùy chỉnh hiển thị icon.
Ví dụ:

```html title="Kích thước và màu sắc"
<i class="i i-[ph--cpu] h-5 w-5 text-blue-500"></i>
```

Vì các lớp `h-5`, `w-5` và `text-blue-500` thuộc CSS layer `utilities`, có
[specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)
cao hơn lớp `i` thuộc CSS layer `utilities.components`, nên ta biết chắc chắn rằng kích thước và màu
sẽ được áp dụng đúng mà không cần quan tâm đến trật tự khai báo của các lớp này trong CSS đầu ra.

### Thêm icon thủ công

Đôi khi, ta cần hiển thị icon riêng biệt không thuộc bộ icon có sẵn nào trong Iconify.
Ví dụ như icon <i class="i ia-3dots h-5 w-5"></i>:

```html title="ia-3dots.html"
<i class="i ia-3dots"></i>  <!-- a === animated -->
```

Trong trường hợp này, ta có thể định nghĩa trực tiếp SVG-trong-CSS như sau:

```css title="ia-3dots.css"
@utility ia-3dots {
	@layer icons {
		--svg: url('...');
	}
}
```

<div class="c-callout c-callout--info c-callout--icon-bulb">

Vì các lớp như `ia-3dots` hay `i-[ph--cpu]` chỉ cung cấp `--svg`, ta có thể tái sử dụng trong
các ngữ cảnh khác. Ví dụ:

```svelte title="Tái sử dụng"
<div class="custom-ui i-[ph--cpu]"></div>
<style>
  .custom-ui {
    /* làm gì đó với biến --svg */
  }
</style>
```

</div>

### Về cú pháp [...]

Có thể bạn đã nhận ra mình dùng cú pháp `i-[ph--cpu]` thay vì `i-ph--cpu`. Dấu ngoặc vuông thể
hiện cú pháp [arbitrary value](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
của Tailwind. Trong trường hợp này, nó cho phép ta sử dụng bất cứ icon nào trong các bộ icon đã
cài đặt nhưng giúp Tailwind tối ưu hóa [language server](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/main/packages/tailwindcss-language-server) bằng cách chỉ tải các icon thật sự được sử dụng thay vì
phải tải trước toàn bộ 1000+ icon vào bộ nhớ.

## Hiển thị Icon thông qua SVG

Trong một số trường hợp hi hữu, ví dụ như SVG quá phức tạp nhưng cần tái sử dụng nhiều lần, hoặc bao gồm
nhiều màu sắc khác nhau, ta cần hiển thị icon trực tiếp thông qua SVG. Khi đó, mình sẽ sử dụng
thư viện [@svelte-put/inline-svg].

```bash
pnpm add -D @svelte-put/inline-svg
```

Thư viện này do mình viết ra và cung cấp hai giải pháp cho hai tình huống khác nhau: SVG tĩnh vs động.

### SVG tĩnh

Tĩnh có nghĩa là SVG không thay đổi và được xác định tại thời điểm phát triển ứng dụng
(build/compile time). Trước tiên, ta cần thêm cấu hình cho Vite:

```js title="vite.config.js"
// :::diff +
import path from 'path';
import { inlineSvg } from '@svelte-put/inline-svg/vite';
// :::
import { defineConfig } from 'vite';

export default defineConfig({
  // :::diff +
  inlineSvg([
    { directories: [path.resolve(__dirname, 'src/lib/assets/images/svg')]},
    { typedef: true },
  ]),
  // :::
  sveltekit(),
});
```

Sau đó, ta có thể nhúng SVG vào markup trong tệp Svelte. Ví dụ:

```svelte title="static.svelte"
<svg class="..." inline-src="custom">
  <!-- nhúng icon tại src/lib/assets/images/svg/custom.svg -->
</svg>

<svg class="..." inline-src="./images/relative.svg">
  <!-- nhúng icon tại ./images/relative.svg -->
</svg>
```

Hãy tham khảo thêm [tài liệu của
@svelte-put/inline-svg](https://svelte-put.vnphanquang.com/docs/inline-svg) đề hiểu rõ cách hoạt động
và cách cấu hình theo nhu cầu của bạn.

### SVG động

Động có nghĩa là SVG chỉ được xác định tại thời điểm chạy ứng dụng (runtime), ví dụ như phải tải từ
qua một trang khác. Trong trường hợp này, `@svelte-put/inline-svg` cung cấp giải pháp thông qua
[Svelte action](https://svelte.dev/docs/svelte/use):

```svelte title="dynamic.svelte"
<script>
  import { inlineSvg } from '@svelte-put/inline-svg';
  const src = 'https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg';
</script>
<svg use:inlineSvg={src}></svg>
```

## Kết

Hy vọng bài viết giúp ích cho bạn khi xây dựng ứng dụng với Svelte nói riêng và trên
nền tảng web nói chung. Giải pháp Iconify+Tailwind trình bày trong bài viết này còn có lợi thế ở
tính linh hoạt và không lệ thuộc vào một framework UI nào, vì vậy có thể tái sử dụng trong những
dự án khác, ví nhụ như với Vue, Astro, ...

Nếu bạn có góp ý hay phản hồi, có thể tìm thấy mình tại [vnphanquang trên
Bluesky](https://bsky.app/profile/vnphanquang.com). Hoặc thông qua [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Cảm ơn bạn đã đọc bài!

[tailwind]: https://tailwindcss.com/
[iconify]: https://iconify.design/
[@svelte-put/inline-svg]: https://svelte-put.vnphanquang.com/docs/inline-svg
