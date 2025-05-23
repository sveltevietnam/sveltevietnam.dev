<script>
  import devtoolsSSRImage from '../images/devtools-ssr-html.webp';
</script>

<div class="c-callout c-callout--info">

Đây là bài viết thứ hai trong chuỗi bài viết có tên "Behind the Screen", nơi mình chia sẻ những kinh nghiệm và bài học trong quá trình xây dựng *sveltevietnam.dev*. Bạn có thể đọc bài viết đầu tiên [tại đây](/vi/blog/20231009-behind-the-screen-blog-chay-bang-com-va-code) (không liên quan đến bài này).

</div>

Ngày nay, giao diện tối (dark mode) đang dần trở thành một tính năng phổ biến và thậm chí là cần thiết để mang lại một trải nghiệm hoàn thiện cho người dùng. Tuy bề ngoài vấn đề là đơn giản nhưng thực tế công việc này đòi hỏi một sự tỉ mỉ và kết hợp nhiều chi tiết nhỏ, tập hợp từ nhiều công nghệ khác nhau. Bài viết này lấy ví dụ trong ngữ cảnh ta dùng Svelte và SvelteKit, tuy nhiên đa số các chi tiết là phi ngôn ngữ, bạn có thể áp dụng chúng vào bất kì framework hay dự án front-end nào.

## Chế độ tối với CSS

Trước tiên, hãy nhìn qua cách hiện thực hóa một giao diện tối đơn giản nhất bằng biến CSS ([CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)). Hãy lấy ví dụ ta đã thiết lập một hệ thống như sau:

```css title="app.css"
:root {
  --color-bg: white;
  --color-fg: black;
}

html {
  background-color: var(--color-bg);
  color: var(--color-fg);
}
```

Chú ý rằng [:root](https://developer.mozilla.org/en-US/docs/Web/CSS/:root) thật ra chỉ là `html`, ta dùng nó theo quy ước chung để khai báo biến CSS. Khi thay đổi giá trị của các biến `--color-*` thì giao diện sẽ tự động cập nhật theo.

Hãy tưởng tượng ta có một tính năng thần kỳ, một [At-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule) có tên là `@dark` có khả năng kích hoạt nội dung bên trong khi chế độ tối được bật:

```css title="Giả định @dark at-rule"
:root {
  --color-bg: white;
  --color-fg: black;

  /* :::diff + */
  @dark {
    --color-fg: black;
    --color-bg: white;
  }
  /* ::: */
}
```

Trong CSS trên, chế độ mặc định là sáng. Khi `@dark` có hiệu lực, ta sẽ thay đổi giá trị của các biến CSS tương ứng với chế độ tối. Nếu làm được chuyện này, coi như ta đã hoàn thành được hơn nửa công việc. Đáng tiếc là CSS không hỗ trợ cú pháp thần kì này. Nhưng đừng lo: trong các phần tiếp ta sẽ cố gắng giả lập lại tính năng `@dark`.

## Khi nào là tối?

Khi nào thì giao diện tối có hiệu lực? Đa số ứng dụng sẽ cho người dùng lựa chọn chế độ hiển thị giữa hai giao diện `light` (sáng) và `dark` (tối) trong cài đặt nào đấy. Tuy nhiên nếu người dùng vừa truy cập ứng dụng lần đầu tiên, thì là `light` hay `dark`?

Câu trả lời là ta sẽ phải dựa vào thiết lập của hệ điều hành thông qua tính năng CSS media [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme):

```css title="prefers-color-scheme"
@media (prefers-color-scheme: dark) {
  /* thiết lập CSS tương ứng cho giao diện tối */
}

@media (prefers-color-scheme: light) {
  /* thiết lập CSS tương ứng cho giao diện sáng */
}
```

Như vậy, có bốn tình huống có thể xảy ra:

1. Người dùng chưa tùy chỉnh gì và chế độ mặc định của hệ điều hành là `light`
2. Người dùng chưa tùy chỉnh gì và chế độ mặc định của hệ điều hành là `dark`
3. Người dùng đã chủ động tùy chỉnh chế độ `light`
4. Người dùng đã chủ động tùy chỉnh chế độ `dark`

Như vậy, cú pháp thần kì `@dark` trong phần trước cần giải quyết số (2) và (4). Số (2) là mặc định hệ thống, còn số (4) là tùy chỉnh chủ động từ người dùng.

### Tùy chỉnh chủ động

Với (4), ta cần thiết lập thêm HTML để thể hiện tùy chỉnh người dùng và có thể lựa chọn được thông qua các CSS selector. Có nhiều cách làm điều này và thường sẽ thông qua class name hoặc attribute. Trong bài viết này, ta lựa chọn cách sau:

```svelte title="app.html"
<html data-color-scheme="dark">
  <!-- nội dung ứng dụng -->
</html>
```

Giá trị của `data-color-scheme` là `dark`, `light`, hoặc `system`. `system` có nghĩa là tình huống (2) sẽ được áp dụng. Ta sẽ bàn tới cách dùng JS để bắt sự kiện và biến đối thuộc tính trên trong phần sau. Với thiết lập này, ta có thể hiệu chỉnh CSS như sau:

```css title="app.css"
:root[data-color-scheme="dark"] {
  /* thiết lập tương ứng */
}
```

### Mặc định hệ thống

Đối với (2), ta đã gần giải quyết được bằng `prefers-color-scheme` như đã thấy ở trên. Tuy nhiên hãy để ý rằng nếu chỉ có vậy thì người dùng có thể sẽ bị khóa ở một chế độ trừ khi họ thay đổi tùy chỉnh của hệ điều hành.

```css title="app.css"
@media (prefers-color-scheme: dark) {
  :root {
    /* ... */
  }
}
```

Ví dụ người dùng có chọn `light` trong cài đặt của ứng dụng nhưng hệ điều hành vẫn là `dark` thì CSS trên vẫn có hiệu lực, vì `prefers-color-scheme` vẫn là `dark`. Để bao quát hơn, ta cần thêm điều kiện phủ định:

```css title="app.css"
@media (prefers-color-scheme: dark) {
  /* :::diff + */
  :root:not([data-color-scheme="light"]) {
  /* ::: */
    /* ... */
  }
}
```

Có nghĩa là: nếu chế độ mặc định của hệ điều hành là `dark` và người dùng không chủ động chọn `light` thì áp dụng CSS này.

---

Vậy là cuối cùng ta cũng có thể viết lại CSS ở phần trước và thay thế `@dark` như sau:

```css title="app.css"
/* sáng */
:root {
  --color-bg: white;
  --color-fg: black;
}

/* tối, theo trường hợp (2) */
/* :::highlight */
@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) {
/* ::: */
    --color-bg: black;
    --color-fg: white;
  }
}

/* tối, theo trường hợp (4) */
/* :::highlight */
:root[data-color-scheme="dark"] {
/* ::: */
  --color-bg: black;
  --color-fg: white;
}

html {
  background-color: var(--color-bg);
  color: var(--color-fg);
}
```

## PostCSS plugin thần kì

Mình có thể nghe bạn nói là "Trời, sao phức tạp quá vậy!?". Đúng là nếu phải nhớ mà viết tất cả các thứ trên mỗi lần muốn áp dụng một CSS nào đấy cho chế độ tối thì thật quá phiền phức. Ví dụ, ta cần biến đổi style của một phần tử có class `.box`:

```css title="app.css"
.box {
  background-color: blue;
}

/* tối, theo trường hợp (2) */
/* :::highlight */
@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) .box {
/* ::: */
    background-color: red;
  }
}

/* tối, theo trường hợp (4) */
/* :::highlight */
:root[data-color-scheme="dark"] .box {
/* ::: */
  background-color: red;
}
```

Quá là nhức đầu đúng không nào. May mắn là, mình đã viết một plugin [PostCSS](https://postcss.org/) tên là [postcss-color-scheme](https://github.com/vnphanquang/postcss-color-scheme) để trừu tượng hóa (abstract) những thứ trên thành chính cú pháp `@dark` đã thấy:

```css title="app.css"
.box {
  background-color: blue;

/* :::highlight */
  @dark {
/* ::: */
    background-color: red;
  }
}
```

Gọn gàng hơn hẳn nhỉ? Mình sẽ không đề cập đến chi tiết plugin này trong bài viết này, bạn có thể đọc thêm tại [github của dự án](https://github.com/vnphanquang/postcss-color-scheme). Nói tóm lại nó sẽ chuyển đổi `@dark` thành những thứ dài dòng đã nêu. Plugin này còn hỗ trợ cú pháp `@light` nếu ta cần tới.

<div class="c-callout c-callout--info">

**Cập nhật - tháng 1 năm 2025**

Kể từ phiên bản thứ hai của `postcss-color-scheme`, cú pháp mặc định cho `@dark` và `@light` thay đổi thành `@media dark` và `@media light` để tương thích hơn với các công cụ hiện tại.

</div>

## CSS cho chế độ tối trong Svelte component

Nếu dùng Svelte một thời gian, bạn sẽ biết rằng CSS trong Svelte là "component-scoped" và Svelte compiler sẽ tự động bỏ đi những CSS không áp dụng được trong component hiện tại. Ví dụ ta có Svelte component sau:

```svelte title="Box.svelte"
<div class="box" />

<style>
  .box {
    background-color: blue;
  }

  .something-else {
    color: blue;
  }
</style>
```

Svelte sẽ thêm một mã hash vào class `.box`, ví dụ `.box.s-SeNnWx1nPv6T`. Bên cạnh đó, `.something-else` sẽ bị lược bỏ đi vì không có phần tự nào với class `.something-else` trong component này. Nếu muốn giữ lại `.something-else`, ta cần thêm `:global`:

```svelte title="Box.svelte"
<style>
  :global(.something-else) {
    color: blue;
  }
</style>
```

Khi ta thiết lập chế độ tối (dù có dùng `@dark` hay hay không), ta sẽ gặp phải tình huống này, vì `html` hay `:root` không tồn tại cục bộ trong component. Khi đấy hãy nhớ thêm `:global`. Hoặc nếu sử dụng `postcss-color-scheme` thêm `global` như sau:

```svelte title="Box.svelte"
<style>
  /* :::diff + */
  :global {
  /* ::: */
    .box {
      background-color: blue;

      @dark {
        background-color: red;
      }
    }
  /* :::diff + */
  }
  /* ::: */
</style>
```

## Mở rộng: chế độ tối với TailwindCSS

<div class="c-callout c-callout--info">

Đây là phần mở rộng bàn về cách thiết lập với [TailwindCSS](https://tailwindcss.com/) để cải thiện hiệu suất của lập trình viên. Nếu bạn không dùng TailwindCSS hay không có hứng thú hãy bỏ qua và [đọc phần kế tiếp](#thay-doi-tuy-chinh-bang-js) nhé.

</div>

Sẽ rất tiện lợi nếu ta có thể sử dụng được cú pháp sau:

```svelte
<div class="bg-blue-500 dark:bg-red-500 light:text-gray-500" />
```

`dark:` và `light:` được gọi là [variant](https://tailwindcss.com/docs/adding-custom-styles#arbitrary-variants) trong Tailwind. Plugin `postcs-color-scheme` đã nêu trong phần trước sẽ giúp thêm hai variant này. Cách cài đặt tùy thuộc vào phiên bản Tailwind bạn đang sử dụng:

<enhanced-code-block display="tabs" group>

```javascript title="Tailwind V3"
/// @file: tailwind.config.*

/** @type {import("tailwindcss").Config } */
module.exports = {
  // your config ...
  // :::diff +
  darkMode: '',
  plugins: [require('postcss-color-scheme/tailwind')],
  // :::
};
```

```javascript title="Tailwind V4"
/// @file: app.css

/* :::diff + */
@import 'tailwindcss';
@import 'postcss-color-scheme/tailwind.css';
/* ::: */
```

</enhanced-code-block>

Hãy xem qua phần [Tailwind Support](https://github.com/vnphanquang/postcss-color-scheme#tailwind-support) để xác định chi tiết cách cài đặt nhé.

<h2 id="thay-doi-tuy-chinh-bang-js">Thay đổi tùy chỉnh bằng JS</h2>

Để người dùng có thể thay đổi chế độ hiển thị một cách chủ động, ta có thể bắt sự kiện từ một nút bấm hay input và sử dụng đoạn mã JS sau:

```javascript title="changeColorScheme"
/**
 * @param {'dark' | 'light' | 'system'} scheme
 */
function changeColorScheme(scheme) {
  document.documentElement.dataset.colorScheme = scheme;
}
```

Chú ý rằng nếu bạn đang dùng [tính năng Server-side Rendering của SvelteKit](https://kit.svelte.dev/docs/page-options#ssr) thì đoạn code trên chỉ chạy được ở phía client vì nó tham chiếu đến `document`.

<div class="c-callout c-callout--info">

Ngày nay, với tính năng [:has](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) của CSS, ta có thể giản lược giải pháp trong bài viết này hơn nữa và không cần đến cả Javascript:

```svelte title="app.html & app.css"
<input id="is-dark" />

<style>
  :root:has(#is-dark:checked) {
    /* thiết lập tương ứng */
  }
</style>
```

Bỏ đi sự phụ thuộc vào Javascript sẽ giúp ứng dụng của ta dễ tiếp cận hơn (accessible) cho người dùng. Tuy nhiên, cần cân nhắc mức độ phức tạp thêm vào codebase.

</div>

## Ghi nhớ tùy chỉnh với cookie và SvelteKit

Cách phổ biến nhất để lưu trữ thông tin tùy chỉnh giao diện là dựa vào web storage như là [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) hay [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Tuy nhiên, vì JS phải được load trước khi ta có thể truy cập tới web storage, tình huống thường gặp là giao diện sẽ hiển thị mặc định rồi sau đó mới chuyển đổi sang đúng tùy chỉnh, gây ra hiệu ứng nhấp nháy khó chịu (FOUC - flash of unstyled content). Có thể giải quyết cách này bằng việc chặn ứng dụng hiển thị cho đến khi JS đã được load xong, nhưng cách này cũng làm giảm trải nghiệm người dùng không kém, và tệ hơn là cả ứng dụng sẽ ko sử dụng được nếu người dùng không truy cập được JS (điều này xảy ra nhiều hơn ta nghĩ, đọc thêm [tại đây](https://kryogenix.org/code/browser/everyonehasjs.html)).

Nếu ứng dụng của bạn là tĩnh hoặc SPA thì không còn lựa chọn nào khác. Nhưng nếu bạn có server thì có thể làm điều này tốt hơn bằng cookie. Vì cả client và server đều truy cập được cookie, ta có thể đọc nó và gán đúng giá trị ban đầu cho `data-color-scheme` trong HTML trả về. Hãy cùng đi qua từng bước.

### Thiết lập ở client

Trước tiên, thêm `PUBLIC_COOKIE_COLOR_SCHEME` vào `.env` để thiết lập một biến môi trường công khai để có thể truy cập từ cả phía client và server (đọc thêm về biến môi trường [tại đây](https://kit.svelte.dev/docs/modules#$env-static-public)):

```bash title=".env"
# :::diff +
PUBLIC_COOKIE_COLOR_SCHEME=color-scheme
# :::
```

<div class="c-callout c-callout--info">

Ta dùng biến này để lưu tên của cookie. Thật ra ta có thể dùng chuỗi cứng `color-scheme` nhưng lưu tên cookie bằng biến môi trường là một quy ước nên làm theo, giúp ta có thể tùy chỉnh một cách linh hoạt tùy theo môi trường mà không cần phải thay đổi mã nguồn.

</div>

Tiếp theo, ta sẽ dùng [document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) API để thiết lập cookie từ phía client. Thêm phần này vào hàm `changeColorScheme` đã có:

```javascript title="changeColorScheme"
// :::diff +
import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';
// :::

/**
 * @param {'dark' | 'light' | 'system'} scheme
 */
function changeColorScheme(scheme) {
  document.documentElement.dataset.colorScheme = scheme;
  // :::diff +
  document.cookie = `${PUBLIC_COOKIE_COLOR_SCHEME}=${scheme}; path=/; SameSite=Lax; Secure`;
  // :::
}
```

Thường cookie được thiết lập ở phía server. Tuy nhiên trong trường hợp này, ta làm chủ được cookie sử dụng cho việc gì, và nó cũng không mang thông tin nhạy cảm như định danh hay khóa API. Dùng `document.cookie` sẽ tiện hơn nhiều vì ta không cần phải cài đặt [form action](https://kit.svelte.dev/docs/form-actions) hay [API endpoint](https://kit.svelte.dev/docs/routing#server).

<h3 id="thiet-lap-o-server">Thiết lập ở server</h3>

Ta dùng [hooks.server](https://kit.svelte.dev/docs/hooks) của SvelteKit để đọc cookie và gán giá trị đúng cho thuộc tính `data-color-scheme` trên HTML trả về trong `response`.

```javascript title=src/hooks.server.js
import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';

/** @type {import('@sveltejs/kit).Handle} */
export const handle = async ({ event, resolve }) => {
  const { locals, cookies } = event;

  locals.colorScheme = (cookies.get(PUBLIC_COOKIE_COLOR_SCHEME)) || 'system';

  const response = await resolve(event, {
    // :::highlight
    transformPageChunk: ({ html }) => html.replace('%cookie-color-scheme%', event.locals.colorScheme)
    // :::
  });

  return response;
}
```

Hãy chú ý *dòng 10*, ta dùng `transformPageChunk`, một hàm được SvelteKit cung cấp trong `resolve`, để thay đổi chuỗi `cookie-color-scheme` theo gía trị của cookie. Để hoàn thiện thiết lập, ta cần sửa `src/app.html` một tí:

```html title=src/app.html
<!-- :::diff - -->
<html>
<!-- ::: -->
<!-- :::diff + -->
<html data-color-scheme="%cookie-color-scheme%">
<!-- ::: -->
```

---

Như vậy, ta có thể ví dụ hành trình của người dùng như sau:

- Người dùng truy cập ứng dụng lần đầu, SvelteKit server hook được kích hoạt, vì cookie `PUBLIC_COOKIE_COLOR_SCHEME` chưa được thiết lập, `cookie-color-scheme` được thay thế bằng giá trị mặc định là `system` trong HTML trả về.
- Trình duyệt nhận được HTML và tự động lựa chọn chế độ hiển thị dựa trên giá trị `prefers-color-scheme` từ hệ điều hành.
- Người dùng thay đổi chế độ hiển thị, cookie được thiết lập, thuộc tính `data-color-scheme` trên `html` được cập nhật, CSS được kích hoạt tương ứng và giao diện thay đổi theo đó.
- Nếu JS được kích hoạt trên trình duyệt và người dùng không chủ động tải lại trang, SvelteKit client-side router sẽ xử lý các điều hướng (chuyển trang) tiếp theo cho đến khi hành trình người dùng kết thúc. Trong suốt quá trình này SvelteKit server hook không chạy lại.
- Khi người dùng tải lại trang hoặc mở trang mới, SvelteKit server hook được kích hoạt, cookie được đọc và giá trị `data-color-scheme` được cập nhật tương ứng. Nếu giá trị là `light` hoặc `dark`, CSS được thiết lập cho chế độ sáng / tối sẽ có hiệu lực, thay vì sử dụng mặc định của hệ điều hành. Chu trình trên được lặp lại sau đó.

Ta có thể xác minh HTML được render từ server với giá trị `data-color-scheme` tương ứng bằng cách xem cửa sổ Network trong Devtools của Chrome ngay trên trang bạn đang đọc:

<img
  src={devtoolsSSRImage}
  alt="Chụp màn hình cửa sổ Network, Devtook của Chrome, hiển thị đúng thuộc tính data-color-scheme"
  loading="lazy"
  decoding="async"
  class="rounded"
/>

### Hỗ trợ Typescript

Nếu bạn dùng Typescript, có thể thêm đoạn mã sau vào `src/app.d.ts` để thỏa type checker:

```typescript title="src/app.d.ts"
declare global {
  namespace App {
    type ColorScheme = 'light' | 'dark' | 'system';

    interface Locals {
      colorScheme: ColorScheme;
    }
  }
}
```

## Mở rộng: truy cập chế độ giao diện bằng JS với Svelte context

<div class="c-callout c-callout--info">

**Cập nhật - tháng 1 - 2025**

Phần này vốn dĩ được viết bằng Svelte 4 và nhiều chi tiết đã trở nên không cần thiết với Svelte 5.
Để tránh dài dòng mình đã quyết định lượt bỏ bớt. Bạn có thể tham khảo [mã nguồn của
sveltevietnam.dev](https://github.com/sveltevietnam/sveltevietnam.dev/blob/5f15e0189ba24b617b76832f3294d315678be09b/sites/sveltevietnam.dev/src/lib/settings/context.svelte.ts#L22-L27) để biết thêm cách kết hợp với Svelte Context.

</div>

## Hợp tác hiệu quả với thiết kế viên

Thật ra, các chi tiết thực hiện bên trên **không** phải là điều phức tạp nhất; một khi ta đã hiểu và thực hiện lần đầu, các lần sau sẽ tương tự và dễ dàng hơn. Điều khó hơn trong việc làm ra một giao diện tối, hay nói chung về bất cứ hệ thống màu sắc nào, là giao tiếp hiệu quả giữa đội ngũ thiết kế và kỹ thuật.

Mỗi dự án và đội ngũ thiết kế sẽ có những quy ước và cách làm riêng, tuy nhiên điều quan trọng nhất, đứng trên phương diện của một lập trình viên, là sự có mặt của tiếng nói kỹ thuật trong quá trình thiết kế, đặc biệt là từ những bước đầu. Với kinh nghiệm ít ỏi của mình trong ngành, những suy nghĩ tưởng chừng là hiển nhiên đối với lập trình viên không phải bao giờ cũng dễ hiểu đối với thiết kế viên, và ngược lại. Hợp tác giữa hai bên nói tóm lại sẽ giúp lập trình viên sử dụng được những gì thiết kế viên làm ra và tránh thay đổi tới mã nguồn hoặc bản vẽ về sau.

Hãy chú ý tới thiết kế bảng màu (color palette). Mỗi màu nên là một "design token" được giao tiếp rõ ràng cho cả thiết kế viên và lập trình viên. Bảng màu có lẽ là yếu tố đầu tiên và quan trọng nhất trong mọi "design system". Cách tổ chức bảng màu để tương thích với các ứng dụng có chế độ tối sẽ phức tạp hơn bình thường một tí vì mỗi màu có thể tồn tại hai phiên bản cho hai giao diện tương tứng.

Tại *sveltevietnam.dev*, mình phân biệt giữa bảng màu gốc (primitive colors) và bảng màu ngữ nghĩa (contextual/semantic colors). Bảng màu gốc là các màu cơ bản ta đã biết: xanh, đỏ, vàng, ... Các màu khác sẽ được xây dựng dựa trên bảng màu cơ bản này tùy theo từng ngữ cảnh trong ứng dụng. Ví dụ, màu cho nền hay văn bản, chính (primary) hay phụ (secondary), thể hiện trạng thái như thành công, cảnh báo, thất bại, ... Để hiểu rõ thêm về cách triển khai hệ thống vừa nêu, bạn có thể ghé thăm trang [Thiết Kế](/vi/thiet-ke).

Dự án *sveltevietnam.dev* cũng sử dụng Figma làm công cụ thiết kế và tận dụng tính năng [Variable](https://help.figma.com/hc/en-us/sections/14506605769879-Variables) để thể hiện các bảng màu trên. Cách này giúp thiết kế viên chủ động ý thức được về các design token tương ứng tới các biến CSS trong quá trình phát triển dự án.

## Kết bài

Chúng ta đã đi qua rất nhiều chi tiết và khía cạnh khác nhau của việc thiết lập chế độ tối cho ứng dụng SvelteKit nói riêng, và một dự án front-end nói chung. Nếu bạn vẫn còn đọc đến tận đây thì thật là xuất sắc - cảm ơn bạn đã kiên nhẫn với sự dài dòng của mình. Nếu bạn có bất kì câu hỏi hay ý kiến gì, hãy tham gia [Discord](https://discord.sveltevietnam.dev) của Svelte Việt Nam để thảo luận thêm nhé!

<div class="c-callout c-callout--info">

Hãy đọc tiếp phần ba của chuỗi bài viết "Behind the Screen" [tại đây](/vi/blog/20231204-behind-the-screen-mot-vai-bi-mat-ve-sveltevietnam-dev) bạn nhé!

</div>

