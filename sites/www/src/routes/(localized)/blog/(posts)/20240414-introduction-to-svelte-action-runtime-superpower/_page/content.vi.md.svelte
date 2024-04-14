<script>
	import { textTip } from '$lib/tooltips';
	import { getNotificationContext } from '$lib/notifications';

  const noti = getNotificationContext();
</script>

[Svelte action] (phân biệt với [SvelteKit form action](https://kit.svelte.dev/docs/form-actions)) là một kĩ thuật giúp dễ dàng thiết lập và đóng gói để tái sử dụng các thao tác xử lý logic và tương tác với DOM:

```svelte
/// svelte-action
<element use:action></element>
```

Svelte action có tính ứng dụng cao và là một trong những tính năng mình hay nhắc đến nhất khi bàn về Svelte. Nếu bạn đã từng sử dụng qua các thư viện [@svelte-put/*][svelte-put] do mình viết, có thể bạn đã nhận ra rằng đa số các package này đều được xây dựng trên nền tảng là Svelte action.

 Hãy cùng tìm hiểu chi tiết hơn về tính năng này thông qua các ví dụ cụ thể nhé.

## Một số ví dụ

Không cần đâu xa, chính trang *sveltevietnam.dev* mà bạn đang đọc đã được áp dụng không ít Svelte action:

### Ví dụ 1: clickoutside

Có lẽ một trong những ứng dụng phổ biến nhất của Svelte action là xử lý sự kiện click bên ngoài một phần tử DOM. Nếu bạn nhấn vào icon <svg inline-src="lucide/settings" class="inline-block" width="16" height="16" stroke-width="2"></svg> tại góc phải ở trên của trang này, hoặc icon <svg inline-src="lucide/qr-code" class="inline-block" width="16" height="16" stroke-width="2"></svg> tại mục "[Chia sẻ](#share)", cửa sổ modal tương ứng sẽ được kích hoạt. Khi bấm vào "backdrop" bên ngoài, cửa sổ sẽ tự đóng lại. Để làm được điều này, mình sử dụng action `clickoutside` từ package [@svelte-put/clickoutside](https://svelte-put.vnphanquang.com/docs/clickoutside):

```svelte
<div use:clickoutside on:clickoutside={close}>...modal...</div>
```

### Ví dụ 2: portal

Đôi khi, ta cần kích hoạt việc hiển thị một thành phần giao diện tại một địa điểm đặc biệt trong ứng dụng, tách rời với địa điểm kích hoạt đó, ví dụ như các modal được nêu trong phần trước, hoặc hệ thống thông báo đẩy (toast, push notification) dưới đây, xây dựng trên [@svelte-put/noti](https://svelte-put.vnphanquang.com/docs/noti):

<div class="p-4 border">
  <button class="c-btn c-btn--pop" on:click={() => noti.helpers.info('Thông báo mẫu, rê chuột để tạm dừng, nhấn x để tắt')}>Kích hoạt thông báo</button>
</div>

Tại nơi modal hoặc thông báo cần được hiển thị, ta sử dụng action `portal`:

```svelte
<aside use:portal={notiStore}>...thông báo được hiển thị tại đây...</aside>
```

### Ví dụ 3: tooltip

Tại mục bên dưới tiêu đề bài viết, bạn sẽ thấy bên cạnh chỉ thị ngôn ngữ là một icon chữ i trong vòng tròn. Nếu rê chuột vào đây, một tooltip sẽ hiển thị, cho người dùng thêm thông tin bổ sung.

<div class="not-prose p-4 border">
  <p class="c-text-cap1 text-fg-200">
    <span>Ngôn ngữ gốc</span>
    <svg
      inline-src="lucide/info"
      class="ml-1 inline-block cursor-help align-text-top"
      stroke-width="1.5"
      height="16"
      width="16"
      use:textTip={{ content: 'Bài viết đang được hiển thị bằng ngôn ngữ gốc' }}
    ></svg>
  </p>
</div>

Tooltip này được áp dụng lên icon thông qua Svelte action `textTip`, xây dựng trên thư viện [@svelte-put/tooltip](https://svelte-put.vnphanquang.com/docs/tooltip):

```svelte
<svg use:textTip={{ content: 'Bài viết đang được hiển thị bằng ngôn ngữ gốc' }}>...icon...</svg>
```

:::div c-callout c-callout--warning
Tooltip nên được cân nhắc kĩ trước khi sử dụng vì nó thường không đảm bảo tính thân thiện cho người dùng, đặc biệt là người dùng sử dụng các công nghệ hỗ trợ. Trong thư viện [@svelte-put/tooltip](https://svelte-put.vnphanquang.com/docs/tooltip#to-tooltip-or-not-to-tooltip) mình cũng có nói thêm về vấn đề này.
:::

### Ví dụ 4: inline SVG

Đôi khi, ta cần nhúng trực tiếp một phần tử SVG vào ứng dụng nhưng không biết rõ đó là SVG nào cho đến khi ứng dụng được chạy trên browser. Ví dụ phổ biết cho tình huống này là một icon SVG ta cần thay đổi màu sắc tùy theo chủ đề của trang web. Để giải quyết vấn đề này, ta có thể sử dụng action `inlineSvg` từ [@svelte-put/inline-svg](https://svelte-put.vnphanquang.com/docs/inline-svg):

<div class="flex items-center justify-between gap-10">

```svelte
///class=flex-1
///title=my-page.svelte
<svg
  use:inlineSvg={"https://raw.githubusercontent.com/sveltejs/branding/master/svelte-logo.svg"}
  class="special svelte"
></svg>
```

  <svg inline-src="svelte" width="67" height="80" class="svelte shrink-0" />
</div>

:::div c-callout c-callout--info
Để bảo đảm tính [progressive enhancement], *sveltevietnam.dev* không dùng `inline-svg` mà thay vào đó là thư viện [@svelte-put/preprocess-inline-svg](https://svelte-put.vnphanquang.com/docs/preprocess-inline-svg) với tính năng tương ứng nhưng được thực thi vào build time, xây dựng trên [Svelte preprocessor].
:::

### Ví dụ 5: mục lục

Phần [Mục lục](#toc) của trang này cũng được hiển thị thông qua Svelte action `toc`, xây dựng trên thư viện [@svelte-put/toc](https://svelte-put.vnphanquang.com/docs/toc). Thư viện này sẽ tự động thu thập các tiêu đề (thẻ `h*`) và chuẩn bị dữ liệu giúp bạn hiển thị mục lục tương ứng:

```svelte
///title=Table of Content (giản lược)
<main use:toc>
  <section>...Table of content...</section>
  <!-- ... -->
</main>
```

Có lẽ bấy nhiêu ví dụ vừa rồi là đủ cho ta thấy rằng ứng dụng cho Svelte action thật sự rất đa dạng. Nhờ đâu mà nó có thể hỗ trợ nhiều tính năng như vậy?

## Phân tích cắt lớp một Svelte action

### Đầu vào và khởi tạo

[Svelte action] đơn giản là một hàm Javascript thông thường, với input là DOM của phần tử mà action được đặt lên.

```typescript
///title=my-action.ts
function action(node: HTMLElement) {
  // thao tác với HTMLElement
}
```

Có thể thấy rằng, sức mạnh của action nằm ở chính sự tối giản của nó. Action đơn thuần mở ra một cửa sổ để thao tác với DOM, vì vậy tất cả mọi thứ bạn có thể làm với vanilla Javascript, CSS, và HTML hầu như đều là khả thi trong Svelte action. Vì nó không chịu phụ thuộc vào cú pháp đặc biệt gì của Svelte (ví dụ cú pháp `$`), ta có thể dễ dàng đóng gói action vào một tệp và tái sử dụng nó tại nơi cần thiết.

Đoạn code khai báo trong `action` sẽ được thực thi khi component đã mount vào DOM ([hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)) đã hoàn thành), hay người ta còn gọi là tại "runtime".

### Runtime vs Progressive Enhancement

Như vừa nêu, action chỉ được thực thi tại runtime, có nghĩa là trong quá trình prerender hoặc server-side-render, mọi tác vụ trong action sẽ không có tác dụng. Ví dụ nếu bạn thêm một class vào `node.classList` trong action, class này chỉ thật sự được thêm vào sao khi trang web đã được tải xong trên browser.

Vì lí do này, để đảm bảo tính [progressive enhancement], bạn chỉ nên sử dụng action khi thật sự cần tương tác với DOM - điều này thường thấy khi tác vụ đó liên quan đến tương tác từ người dùng. Đối với các thao tác không liên quan đến tương tác người dùng, khả năng cao là bạn sẽ không cần đến action hay thậm chí là Javascript tại runtime; [Svelte preprocessor] có thể là một giải pháp tốt cho trường hợp này mà bạn nên cân nhắc. Để biết thêm về Svelte preprocessor, hãy đọc qua bài "[Viết một Svelte preprocessor đơn giản](/vi/blog/20231020-viet-mot-svelte-preprocessor-don-gian)".

### Cấu hình và cập nhật

Tham số thứ hai mà action nhận vào là một dữ liệu cơ bản (primitive) hoặc đối tượng Javascript với cấu trúc tùy chọn, phục vụ cho việc cấu hình action theo tùy trường hợp sử dụng:

```typescript
/// title=my-action.ts
// :::diff +
type ActionParameter = {
  enabled?: boolean;
};
// :::
// :::diff -
function action(node: HTMLElement) {
// :::
// :::focus
// :::diff +
function action(node: HTMLElement, param?: ActionParameter) {
//:::
//:::
  if (param?.enabled) { // ... }
}
```

Vì biến số trong Svelte mang tính "reactive", và thực tế là `param` có thể thay đổi bất kì lúc nào, action cho ta khả năng cập nhật hành vi của nó khi `param` thay đổi thông qua method `update` tại đầu ra:

```typescript
/// title=my-action.ts
type ActionParameter = {
  enabled?: boolean;
};
function action(node: HTMLElement, param?: ActionParameter) {
  // :::diff +
  return {
    // :::focus
    update: (newParam?: ActionParameter) => {
      if (newParam?.enabled) {
        // bật lên
      } else {
        // tắt đi
      }
    },
    // :::
  };
  // :::
}
```

Cuối cùng, ta dọn dẹp tài nguyên (ví dụ như gọi `removeEventListener`) trong method `destroy` tại đầu ra:

```typescript
/// title=my-action.ts
type ActionParameter = {
  enabled?: boolean;
};
function action(node: HTMLElement, param?: ActionParameter) {
  return {
    update: (newParam?: ActionParameter) => {
      if (newParam?.enabled) {
        // bật lên
      } else {
        // tắt đi
      }
    },
    // :::focus
    // :::diff +
    destroy: () => {
      // dọn dẹp
    },
    // :::
    // :::
  };
}
```

Đó, Svelte action chỉ có vậy thôi bạn ạ! API này chắc là mất năm phút để làm quen, còn lại toàn bộ chỉ là kiến thức nền tảng web thông thường.

## Phát sự kiện ([CustomEvent])

Đây không phải là một phần của Svelte action API nhưng là một nhu cầu hay gặp khi viết action. Trong ví dụ dưới đây, thông qua [CustomEvent] web API, ta sẽ phát ra một sự kiện tùy chỉnh khi người dùng click vào phần tử:

```typescript
/// title=my-action.ts
type ActionParameter = {
  enabled?: boolean;
};
export function action(node: HTMLElement, param?: ActionParameter) {
  function handleClick() {
    // :::focus
    // :::highlight
    const customEvent = new CustomEvent('hello', { detail: 'hello' });
    node.dispatch(customEvent);
    // :::
    // :::
  }
  if (param?.enabled) {
    node.addEventListener('click', handleClick);
  }
  return {
    update: (newParam?: ActionParameter) => {
      // giản lược
    },
    destroy: () => {
      node.removeEventListener('click', handleClick);
    },
  };
}
```

Với action trên, ta có thể lắng nghe sự kiện `hello` trên phần tử và xử lý nó tại component:

```svelte
///title=my-page.svelte
<script>
  import { action } from './my-action';

  function emitHandler(event) {
    console.log(event.detail); // 'hello'
  }
</script>

<!-- :::focus -->
<!-- :::highlight -->
<element use:action on:hello={emitHandler}>...</element>
<!-- ::: -->
<!-- ::: -->
```

## Khai báo action với Typescript

Nếu có thể, bạn hãy sử dụng Typescript để thiết lập type cho action của bạn để hỗ trợ intellisense trong quá trình dev. Khai báo type cho action rất dễ dàng, bạn chỉ cần mở rộng các [type có sẵn từ `svelte/action`](https://svelte.dev/docs/svelte-action#types):

```typescript
/// title=my-action.ts
// :::diff +
import type { ActionReturn } from 'svelte/action';
// :::

type ActionParameter = {
  enabled?: boolean;
};

//:::diff +
type ActionAttributes = {
  'on:hello': (event: CustomEvent<'hello'>) => void;
};
//:::

// :::diff -
export function action(node: HTMLElement, param?: ActionParameter): {
// :::
// :::diff +
export function action(node: HTMLElement, param?: ActionParameter): ActionReturn<ActionParameter | undefined, ActionAttributes>{
// :::
  // giản lược
}
```

:::div c-callout c-callout--info
Chú ý rằng trong ví dụ này, ta dùng tổ hợp `ActionParameter | undefined` tại `ActionReturn` vì `action` cho phép người dùng không cần truyền bất kì tham số gì.
:::

## Action hay component?

Nếu bạn đến từ các framework hay sử dụng component làm nền tảng để xây dựng mọi thứ, có thể bạn sẽ thắc mắc rằng các ví dụ đã nêu trong bài viết này có thể viết bằng component được không?

```svelte
///title=component-for-everything.svelte
<Clickoutside>
  <element>...</element>
</Clickoutside>

<Tooltip>...</Tooltip>
```

Câu trả lời là được. Tuy nhiên, khi sử dụng component, ta thường cần phải bọc `element` trong một element cha, hoặc sử dụng các thủ thật để hạn chế ô nhiễm DOM. Lấy `clickotuside` làm một ví dụ điển hình. Bạn sẽ hiện thức hóa tính năng này bằng component như thế nào?

```svelte
///title=Clickoutside.svelte
<!-- mã nguồn từ joeattardi/svelte-click-outside: https://github.com/joeattardi/svelte-click-outside/blob/master/src/index.svelte -->
<script>
  // giản lược
</script>

<svelte:body on:click={onClickOutside} />
<div bind:this={child}>
  <slot></slot>
</div>
```

So sánh nó với [mã nguồn của @svelte-put/clickoutside](https://github.com/vnphanquang/svelte-put/blob/9cedde8c33ecce7b1a4058425bf29b6f7a292b91/packages/clickoutside/src/clickoutside.js#L57-L84), bạn có thể tự quyết định cho chính mình xem phương thức nào là dễ đọc và phù hợp hơn với phong cách của mình. Tuy nhiên, hy vọng ta có thể đồng ý được rằng đặt vào ví dụ thực tế, mọi thao tác sẽ trở nên rườm rà hơn vì cần phải thông qua wrapper `div` và vì ta không có khả năng truy cập trực tiếp vào `element` mà ta muốn thao tác.

```svelte
///title=my-page.svelte
<element use:clickoutside class="absolute ...">...</element>
<!-- vs -->
<Clickoutside class="absolute ...">
  <element>...</element>
</Clickoutside>
```

Đối với mình, việc sử dụng component cho những công việc như trên không bảo đảm tính "[đơn nhiệm](https://en.wikipedia.org/wiki/Single_responsibility_principle)". Component là giải pháp tốt để đóng gói giao diện. Tuy nhiên, trong trường hợp `clickoutside`, ta chỉ muốn đóng gói logic về xử lý sự kiện, còn các quyết định về markup hoặc style đều không liên quan và nên được tách biệt.

:::div c-callout c-callout--success c-callout--icon-bulb
Nói tóm lại, khi sử dụng Svelte, mình thường tránh sử dụng component nhiều nhất có thể, và thay vào đó tận dụng những tính năng như action, context, store để xử lý những công việc không liên quan đến giao diện.
:::

## Thay đổi trong Svelte 5

Như bạn đã biết, Svelte 5 sẽ sớm được công bố, với nhiều thay đổi về mặt cú pháp. May mắn là, cách viết và sử dụng action trong bài viết này sẽ vẫn hoạt động bình thường. Chỉ có duy nhất một thay đổi mà bạn có thể sẽ cần quan tâm trong tương lai, đó là cú pháp `on...` để lắng nghe sự kiện sẽ không có dấu hai chấm nữa:

```svelte
/// title=my-page.svelte
<!-- :::diff - -->
<element use:action on:hello={...}>
<!-- ::: -->
<!-- :::focus -->
<!-- :::diff - -->
<element use:action onhello={...}>
<!-- ::: -->
<!-- ::: -->
```

Hãy nhớ thay đổi cả `ActionAttributes` bạn nhé:

```typescript
/// title=my-action.ts
type ActionAttributes = {
  // :::diff -
  'on:hello': (event: CustomEvent<'hello'>) => void;
  // :::
  // :::focus
  // :::diff +
  'onhello': (event: CustomEvent<'hello'>) => void;
  // :::
  // :::
};
```

:::div c-callout c-callout--info
Thêm một lần nữa, ta thấy rằng action chỉ đơn giản là một hàm Javascript thuần không phụ thuộc quá nhiều vào cú pháp của Svelte. Vì vậy, action có tính ổn định cao cho dù Svelte có thay đổi trong tương lai. Những cải thiện trong Svelte 5, đặc biệt là tính đóng gói của rune - có thể sử dụng ở cả các tệp `js` hay `ts` - thậm chí còn mở ra nhiều khả năng để action có thể tương tác linh hoạt hơn với các thành phần khác của ứng dụng.

Svelte action quả thật là một trong những thiết kế API tốt nhất mình từng thấy.
:::

## Kết

Cảm ơn bạn đã đọc bài. Bạn có thể tham khảo thêm ví dụ về action từ các pacakge tại [svelte-put]. Còn bạn thì sao? Bạn đã hay sẽ sử dụng Svelte action như thế nào trong dự án của mình? Hãy chia sẻ qua [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev) bạn nhé!

<style>
  svg.svelte {
    filter: drop-shadow(0 0 0.5rem theme('colors.svelte'));
  }
</style>

[Svelte action]: https://svelte.dev/docs/svelte-action
[Svelte preprocessor]: https://svelte.dev/docs/svelte-compiler#preprocess
[CustomEvent]: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
[svelte-put]: https://svelte-put.vnphanquang.com/
[Progressive Enhancement]: https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement
