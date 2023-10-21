Trong bài viết này, chúng ta sẽ dùng [Svelte preprocessor](https://svelte.dev/docs/svelte-compiler#preprocess) để giải quyết một vấn đề đơn giản (nhưng ta sẽ đi phức tạp hóa mọi chuyện để học được nhiều hơn). Nếu bạn chưa từng làm điều tương tự, hy vọng bài viết sẽ cung cấp ví dụ để bạn tham khảo và hiểu thêm về cách hoạt động của Svelte preprocessor.

## Vấn đề

Một trang web có thể có rất nhiều đường dẫn ngoài (liên kết đến các trang không cùng tên miền). Đối với các đường dẫn này, ta thường thêm các thuộc tính (attribute) như `target=_blank` và `rel=…` (với giá trị ví dụ như `noreferrer noopener`) để đảm bảo tính bảo mật và trải nghiệm tốt cho người dùng. Vậy ta đặt vấn đề rằng: có cách nào để tự động hoá việc này không? Nói cách khác, làm sao để phát hiện đường dẫn ngoài và thêm hai thuộc tính trên một cách tự động thay vì phải thêm tay cho mỗi thẻ `a`? Svelte preprocessor là một phương án giải quyết.

## Các cách khác

Trước khi đi sâu vào chi tiết thực hiện, chúng ta hãy sơ lược những phương án khác ngoài Svelte preprocessor. Một vấn đề thường có nhiều cách giải quyết, ta lúc nào cũng nên biết những cách khác để có cái nhìn tổng quát hơn.

### Svelte Component

Có lẽ đây là cách dễ đoán nhất: tạo một [component](https://svelte.dev/docs/svelte-components) và khai báo các thuộc tính đã nêu trong đấy. Tuy nhiên, phương án này khá lãng phí, vì nó chỉ làm mỗi việc là gói thẻ `a` lại. Thay vì:

```svelte
<a href="..." target="_blank" rel="noreferrer noopener">...</a>
```

thì ta sẽ dùng:

```svelte
<ExternalLink href="...">...</ExternalLink>
```

Với cách này, ta sẽ phải thiết lập [prop](https://svelte.dev/docs/svelte-components#script-1-export-creates-a-component-prop) là bước trung gian để truyền thuộc tính của `a` như `class`,  `aria-`, `data-`, … Ngoài ra, khi dùng component, ta mất đi quyền truy cập trực tiếp tới phần tử `a` (`HTMLAnchorElement`), gây khó khăn cho việc sửa đổi style, quản lý sự kiện (event handling), hoặc sử dụng Svelte animation và transition.

```svelte
<a animate:flip transition:fly /> <!-- ✅ -->
<!--
  mã dưới đây sẽ báo lỗi vì các directive `animate` và `transition`
  chỉ áp dụng cho element chứ không dùng được cho component
-->
<ExternalLink animate:flip transition:fly /> <!-- ❌ -->
```

Với Svelte, thông thường mình sẽ tránh viết component nếu không thật sự cần thiết. Một điểm mình thích ở Svelte là nó cung cấp các directive tiện lợi dành riêng cho phần tử HTML thuần, như `animate`, `transition`, `use`, `on`; qua đó, một cách gián tiếp, Svelte khuyến khích mình sử dụng các công nghệ thuần túy nhiều hơn. Trước đây khi mình đã quá quen với React, việc viết HTML thuần trở nên lạ lẫm, đặc biệt là khi áp dụng các mô hình quy mô (và cồng kềnh) như [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/). Không nói đến việc đúng sai, nhưng quay trở về với HTML làm mình cảm thấy rất nhẹ nhàng.

### Svelte Action

Svelte cung cấp một giải pháp để thao tác trên `HTMLElement` gọi là [action](https://svelte.dev/docs/svelte-action), thường thấy qua directive `use:action`. Đây là tính năng mình thích nhất trong Svelte. Nó là nền tảng mà mình sử dụng cho phần lớn các package trong dự án [svelte-put](https://github.com/vnphanquang/svelte-put) của mình. Nói ngắn gọn, action giúp ta truy cập `HTMLElement` sau khi nó đã được khởi tạo trên [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction). Trong ví dụ của bài viết này, ta thao tác trên `HTMLAnchorElement` để thêm các thuộc tính cần thiết:

```svelte
<script>
  function externalLink(node) {
    node.target = '_blank';
    node.rel = 'noreferrer noopener';
  }
</script>

<a href="..." use:externalLink></a>
```

Vậy là xong, đơn giản nhỉ? Tuy nhiên, cách này cần có Javascript (JS), và chỉ hoạt động trên browser sau khi trang đã render, có nghĩa là trong HTML ban đầu trả về từ response sẽ không có các thuộc tính đó. Nhưng nếu bạn không quan tâm về server-side-rendering (ví dụ như với một ứng dụng SPA) thì giải pháp này là đủ.

### Vite Plugin

Trong [plugin API](https://vitejs.dev/guide/api-plugin.html) của [Vite](https://vitejs.dev/), ta có thể dùng `transform` hook để biến đổi mã nguồn. Ý tưởng như sau:

1. kiểm tra nếu là tệp HTML thì tiếp tục bước sau,
2. dùng [regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions) hoặc [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) để tìm thẻ `a`, và biến đổi mã để thêm các chuỗi kí tự cho các thuộc tính cần thiết,
3. trả về mã đã biến đổi, và source map đã được cập nhật.

Phương án này mang tính nâng cao hơn, đòi hỏi bạn cần có kinh nghiệm làm việc với các công cụ nền tảng, ở tầng thấp. Cách này là đủ nếu ta đang viết HTML thuần không dùng framework gì, hoặc nếu ta thiết lập Svelte để tạo ra các trang tĩnh không cần đến JS ([csr](https://kit.svelte.dev/docs/page-options#csr) đã được tắt).

Tuy nhiên, SvelteKit sẽ mặc định sử dụng một kỹ thuật gọi là [hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)) để biến một trang web tĩnh trở thành động trong môi trường phù hợp để Svelte thực hiện các tác vụ cần có JS. Hãy tưởng tượng rằng SvelteKit có hai phiên bản cho trang web của bạn: một là HTML đã được prerender hoặc render từ server, và hai là một phiên bản tương tự nằm trong JS. Khi hydration xảy ra, phiên bản Javscript sẽ thay thế phiên bản HTML. Vite plugin của chúng ta ở trên chỉ thay đổi phiên bản HTML, phiên bản Javscript vẫn chưa được cập nhật, nên khi hydration xảy ra, các thuộc tính đã thêm vào sẽ biến mất.

Vậy là cách này trái ngược với action. Action thì có được sau hydration, nhưng không có ở HTML ban đầu; còn vite plugin thì có được ở HTML mà lại mất đi sau hydration.

## Vậy Svelte preprocessor thì sao?

Svelte preprocessor sẽ giúp ta làm được các việc sau:

- phát hiện được đường dẫn ngoài và tĩnh (sẽ giải thích sau) và thêm thuộc tính phù hợp. Thao tác này là hoàn toàn tự động, ta không cần thêm gì tại thẻ `a`,
- có được thuộc tính ở cả HTML ban đầu và sau khi hydration đã xảy ra.

Nghe thật kì diệu phải không? Nếu bạn để ý thì lý do bạn dùng được Typescript, SASS, hay PostCSS trong Svelte chính là nhờ các preprocessor đấy.

## Viết preprocessor

Chúng ta đi lòng vòng khá nhiều rồi. Bắt tay vào việc chính nào. Dưới đây là đoạn mã giản lược cho Svelte preprocessor mà ta đã bàn nãy giờ:

```javascript
import MagicString from 'magic-string';
import { walk } from 'svelte/compiler';
import { parse } from 'svelte-parse-markup';

/** @type {import('svelte/compiler').PreprocessorGroup} */
export const preprocessExternalLink = {
  markup(o) {
    const { content, filename } = o;
    // (1)
    const s = new MagicString(content);
    const ast = parse(content, { filename });

    // (2)
    walk(ast.html, {
      enter(node) {
        if (node.type === 'Element' && node.name === 'a') {
          let external = false;

          // (3)
          const hrefAttr = node.attributes.find((attr) => attr.name === 'href');
          if (hrefAttr && hrefAttr.value?.[0]?.type === 'Text') {
            const href = /** @type {string} */(hrefAttr.value[0]?.raw);
            if (href.startsWith('http')) {
              const url = new URL(href);
              external = !['localhost', 'yourhostname'].includes(url.hostname);
            }
          }

          // (4)
          const firstChild = node.children[0];
          if (external && firstChild) {
            s.appendLeft(firstChild.start - 1, ' target="_blank" rel="noreferrer noopener"');
          }
        }
      },
    });

    return {
      code: s.toString(),
      map: s.generateMap(),
    };
  },
};
```

Ý tưởng của đoạn mã trên khá đơn giản như sau:

1. Với mỗi tệp `.svelte` đi qua preprocessor, ta `parse` mã nguồn thành một cấu trúc `AST`.
2. Đi qua từng `node` của `AST`, kiểm tra xem nó có phải là thẻ `a` không, nếu đúng thì tiếp tục.
3. Tìm thuộc tính `href`, so sánh xem nó có trỏ về tên miền ngoài, nếu có thì thẻ `a` chính là đường dẫn ngoài và ta tiếp tục bước sau.
4. Thêm thuộc tính, trả về mã mới, source map mới.

Nhờ vào các thư viện có sẵn, các thao tác khó khăn nhất trở nên dễ dàng hơn nhiều:

- [magic-string](https://github.com/Rich-Harris/magic-string): viết bởi chính [Rich Harris](https://github.com/Rich-Harris) (tác giả của Svelte), giúp ta thực hiện các thao tác biến đổi mã nguồn và tạo source map.
- [svelte-parse-markup](https://github.com/bluwy/svelte-parse-markup): viết bởi [Bjorn Lu](https://github.com/bluwy) (thành viên tích cực của Svelte và Vite), giúp biến mã nguồn thành `AST`.
- Để biết `AST` trông ra sao, bạn có thể sử dụng [Svelte REPL](https://svelte.dev/repl/hello-world?version=4) và đổi cửa sổ xuất sang “AST output”.

Như vậy là, ta thấy preprocessor có rất nhiều điểm tương đồng với phương án Vite plugin. Điểm khác biệt là ta đang biến đổi chính mã nguồn Svelte (biến mã Svelte này thành một mã Svelte khác) chứ không phải chỉ thao tác trên HTML trong kết quả build.

## Mở rộng

Khi nãy, ta có nói rằng đoạn mã preprocessor trên chỉ hoạt động được với “đường dẫn ngoài và tĩnh”. Tĩnh là gì? Đó là nếu `href` trong mã nguồn tại thẻ `a` là một chuỗi cứng chứ không thay đổi theo một biến.

```svelte
<!-- tĩnh -->
<a href="https://sveltevietnam.dev">...</a>

<!-- không tĩnh -->
<a href={SOME_VARIABLE}>...</a>
```

Trong trường hợp này, preprocessor ta vừa viết sẽ không phát hiện được đây là đường dẫn ngoài. Để giải quyết vấn đề này, ta có thể tự quy ước một thuộc tính bất kì làm dấu hiệu cho preprocessor: nếu thẻ `a` có thuộc tính này, nó chính là đường dẫn ngoài. Ví dụ:

```diff
- <a href={SOME_VARIABLE}>...</a>
+ <a href={SOME_VARIABLE} data-external>...</a>
```

Khi đó, ta cần thay đổi một tí mã preprocessor của chúng ta xem nếu có thuộc tính này thì thực hiện các thao tác tương tự.

```diff
- let external = false;
+ let external = node.attributes.some((attr) => attr.name === 'data-external');

// ... thay đổi code tương ứng
```

Ngoài ra, ta cũng sẽ gặp lỗi nếu thẻ `a` đã có sẵn thuộc tính `rel` hay `target`. Ta có thể mở rộng đoạn mã trên để kiểm tra và xử lý những tình huống này. Để tránh dài dòng, bạn có thể đọc [đoạn mã hoàn chỉnh tại đây](https://github.com/sveltevietnam/sveltevietnam.dev/blob/a8a2ff08e9b715e34f4c677bd620b8c929f4aae9/sites/www/svelte.config.js#L25-L80) - đây là đoạn mã được sử dụng bởi [sveltevietnam.dev](http://sveltevietnam.dev) cho mục đích tương tự trên chính trang bạn đang đọc.

## Thắc mắc

Có thể bạn sẽ tự hỏi là làm sao để biết được hết những API như này. Câu trả lời là bạn sẽ phải viết thôi, viết càng nhiều thì càng hiểu ra nhiều. Những thứ ở tầng thấp như vầy thường ít được nhắc đến trong các bài báo hay video trên youtube, vì vậy bạn sẽ phải học từ cách đọc mã nguồn của các preprocessor đã có.

Bạn cũng có thể hỏi rằng rõ ràng ta đã phải viết nhiều mã hơn rất nhiều so với hai giải pháp đầu tiên (component và action), vậy có đáng không? Preprocessor phải viết nhiều hơn nhưng chỉ viết một lần và ở một chỗ, và nó giải quyết được các vấn đề đã nêu. Hãy xem đây như một ví dụ để bạn hiểu hơn về preprocessor, còn mức độ áp dụng của preprocessor cụ thể trong bài viết này thì tùy tình huống và nhu cầu ta mới xác định được.

Một chi tiết nhỏ có thể bạn sẽ không để ý đến. Đoạn mã trên được viết bằng JS thuần và sử dụng [JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html). Mình sẽ không bàn nhiều về vấn đề này (để dành cho một bài viết khác), nhưng như vậy sẽ đơn giản hơn rất nhiều. Các API và thư viện ta sử dụng ở đây được viết bằng JS và ưu tiên tính hiệu quả chứ không được thiết kế để thỏa mãn các ràng buộc của Typescript (TS). Vì vậy bạn sẽ tốn nhiều thời gian hơn nếu viết preprocessor bằng TS.

## Tổng kết

Tóm lại, Svelte preprocessor là một đoạn mã trong quy trình hoạt động của Svelte compiler, được dùng để biến đổi mã nguồn Svelte tùy theo nhu cầu. Trong bài viết này, ta đã viết một preprocessor để thêm các thuộc tính `rel` và `target` nếu phát hiện thẻ `a` là đường dẫn ngoài. Thông qua ví dụ đó, ta đã thấy được cách vận hành cơ bản của một preprocesor tiêu biểu và sự linh hoạt của nó. Svelte preprocessor có thể dùng để làm nhiều việc hơn thế nữa, và sự thật là đa số chúng ta đều không để ý rằng ta đã và đang dùng preprocessor rồi đấy. Hy vọng bài viết sẽ giúp bạn có thêm một công cụ trong hành trình lập trình của mình với Svelte.
