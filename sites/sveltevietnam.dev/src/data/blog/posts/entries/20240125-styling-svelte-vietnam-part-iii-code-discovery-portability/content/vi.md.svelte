<script>
	import taliwindVSCodeIntellisenseImage from '../images/tailwindcss-vscode-intellisense.png?format=webp&imagetools';
	import cssToJssInlineImage from '../images/css-to-jss-inline.png?format=webp&imagetools';
	import cssToJssBuildImage from '../images/css-to-jss-build.png?format=webp&imagetools';
	import designSystemPackageImage from '../images/design-system-package.png?format=webp&imagetools';
</script>

Bài viết "Styling cho Svelte Việt Nam" được chia làm ba phần, liệt kê sau đây. Bạn đang đọc phần cuối cùng.

1. [Phần I - TailwindCSS](/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-i-tailwindcss)
2. [Phần II - CSS Component](/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-ii-css-components)
3. [Phần III - Khám phá và tái sử dụng mã
   nguồn](/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-iii-kham-pha-va-tai-su-dung-ma-nguon)

---

Trong hai phần trước, ta xác định rằng TailwindCSS là một công cụ tuyệt vời để xây dựng hệ thống thiết kế, và rằng CSS Component là giải pháp tối giản để đóng gói các thành phần giao diện cơ bản. Trong phần này, ta sẽ tìm hiểu cách kết nối những lý thuyết đó trong một dự án thực tế.

## Update - Tailwind V4

<p class="text-right text-xs italic">
Phần này được thêm vào bài viết vào tháng 1, năm 2025.
</p>

Bài viết này được viết cho Tailwind V3. Trong [phiên bản 4 của Tailwind](https://tailwindcss.com/blog/tailwindcss-v4-beta) (hiện đang trong giai đoạn beta tại thời điểm cập nhật), cách thiết lập sẽ có một số thay đổi - đa số sẽ dễ dàng hơn và trực tiếp bằng CSS. Tuy vậy, mình hy vọng các ý tưởng và giải pháp trong bài viết vẫn mang giá trị tham khảo nhất định.

Theo đó, bạn có thể khai báo một CSS component trong Tailwind V4 một cách đơn giản như sau:

```css title="c-btn.css"
@utility c-btn {
  @layer components {
    /** CSS tương ứng */
  }
}
```

Trong V4, Tailwind sẽ sắp xếp mọi CSS khai báo trong `@utility` vào lớp CSS `utilities`. Để đảm bảo tính độc lập, ta có thể bao CSS trong khối `@layer components` như trên. Lưu ý rằng tại đầu ra, CSS mong muốn sẽ nằm lồng vào lớp `utilities.components`.

```css title="output.css"
@layer utilities {
  @layer components {
    .c-btn {
      /** CSS tương ứng */
    }
  }
}
```

---


## Tailwind @layer

Trước hết, ta cần biết rằng TailwindCSS sắp xếp CSS vào ba layer (tầng hay lớp). Ta thường thấy ba layer này thông qua phần khai báo của Tailwind:

```css title="src/app.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Theo đó:

- `base` là tầng thấp nhất, chứa những quy luật CSS với mục đích đặt lại một chuẩn mặc định cho các phần tử HTML (thường được gọi là "reset CSS"),
- `components` là nơi ta sẽ thêm các quy luật tùy chỉnh, trong bài viết này chính là các CSS component,
- cuối cùng `utilities` chứa các quy luật phổ biến của Tailwind như `.bg-red-500` hay `.text-center`.

Mặc dù cú pháp `@tailwind` là đặc hữu từ Tailwind, [CSS @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) là một tính năng hợp lệ của CSS - được chuẩn hóa từ năm 2022. Hãy chú ý trình tự khai báo của các layer này: quy luật CSS trong layer sau có thể ghi đè lên quy luật trong layer trước bất kể [tính specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity). Có nghĩa là, ví dụ như ta có một CSS component `.c-btn` trong layer `components`:

```css title=app.css
@layer components {
  .c-btn {
    /* ... */
    text-align: center;
  }
}
```

Giả sử trong một tình huống đặc biệt nào đó, ta cần quy định cho `c-btn` thuộc tính `text-align` với giá trị là `left`, ta hoàn toàn có thể sử dụng kèm lớp tương ứng trong layer `utilities`:

```html
<button class="c-btn text-left"></button>
```

Dù `.c-btn` và `.text-left` ngang hàng nhau ở tính specificity, `.text-left` được khai báo ở layer sau nên sẽ được áp dụng.

<div class="c-callout c-callout--info">

Bạn có thể thấy rằng CSS Component ở trên được thêm tiền tố `c-`. Đây là quy ước của dự án *sveltevietnam.dev* và không bắt buộc. Tuy nhiên, nó giúp ta dễ dàng nhận diện một CSS Component và cung cấp một số lợi ích cho trình soạn thảo mà ta sẽ bàn tới ở phần sau.

</div>

## Khai báo CSS Component

Trong phần trước, ta thấy một cách khai báo CSS component là sử dụng `@layer components`:

```css title="src/app.css"
@layer components {
  .c-btn {
    text-align: center;
    background-color: theme('colors.blue.500');
    color: white;
    /* ... */
  }
}
```

Đây là giải pháp đơn giản nhất và nếu bạn mới sử dụng Tailwind thì nên bắt đầu từ cách này. Nhược điểm của giải pháp trên là nó không tương thích với TaiwindCSS language server và các plugin hỗ trợ Tailwind cho các trình soạn thảo. Khi rê chuột vào `c-component` trong phần markup, plugin không thể nhận diện được `c-btn` giống như các lớp Tailwind tiêu biểu khác.

<figure>
	<img src={taliwindVSCodeIntellisenseImage} class="mx-auto max-w-full rounded" width="840" height="253" alt="rê chuột vào lớp bg-* khi đang gõ sẽ hiển thị dropdown intellisense trong vscode" />
	<figcaption>
    Hình 1: cửa sổ intellisense trong VS Code cho các lớp Tailwind (nguồn:
    <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">VSCode Extension: Tailwind CSS IntelliSense</a>)
  </figcaption>
</figure>

<div class="c-callout c-callout--info">

Vì sao ta quan tâm đến việc một lớp có được nhận diện bởi TailwindCSS language server hay không? Để đảm bảo rằng mã nguồn có thể dễ dàng được "khám phá" một cách tự nhiên trong quá trình làm việc của lập trình viên. Ta chỉ cần gõ `c-` và kích hoạt trình soạn thảo để nhận diện hoặc đề xuất các CSS component trong hệ thống thiết kế của dự án, tiết kiệm thời gian và giảm thiểu sai sót.

</div>

## Khai báo CSS Component bằng Tailwind plugin

Tailwind có cung cấp [API để viết plugin](https://tailwindcss.com/docs/plugins). Đây là giải pháp rất hiệu quả nếu ta cần linh hoạt trong cấu hình và tương thích với TailwindCSS language server. Vì API này sử dụng Javscript và cung cấp quyền truy cập đến PostCSS, ta có thể mở rộng hầu hết mọi khía cạnh của Tailwind mà không bị giới hạn bởi cú pháp CSS như giải pháp CSS thuần túy ở phần trước.

```javascript title=tailwind.config.js
// :::diff +
import definePlugin from 'tailwindcss/plugin';
// :::

// :::diff +
const myplugin = definePlugin(function ({ addComponents }) {
  addComponents({
    '.c-btn': {
      textAlign: 'center',
      backgroundColor: `theme('colors.blue.500')`,
      color: 'white',
    },
  });
});
// :::

/** @type {import("tailwindcss").Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
  // :::diff +
	plugins: [myplugin],
  // :::
};
```

<div class="c-callout c-callout--warning">

Chú ý rằng mặc dù đoạn code `tailwind.config.js` trên được chạy trong ngữ cảnh NodeJS, ta đang sử dụng [cú pháp ESM](https://nodejs.org/api/esm.html#enabling). Thường thì cú pháp này đòi hỏi thiết lập `package.json` với thuộc tính `"type": "module"`:

```javascript title=package.json
{
  // :::diff +
  "type": "module",
  // :::
  // ...
}
```

ESM đang dần được chuẩn hóa làm mặc định trong hệ sinh thái NodeJS. Trong các phần tiếp theo sau đây, ta sẽ tiếp tục sử dụng cú pháp này.

</div>

Ta còn có thể sử dụng plugin API để thêm vào các tầng [base](https://tailwindcss.com/docs/plugins#adding-base-styles), [utilities](https://tailwindcss.com/docs/plugins#adding-utilities), thay đổi [bảng màu và hệ thống đo lường](https://tailwindcss.com/docs/plugins#extending-the-configuration), hoặc khai báo [variant](https://tailwindcss.com/docs/plugins#adding-variants) mới. Tất cả tùy chỉnh vừa nêu sẽ được TailwindCSS language server nhận diện. Tuy nhiên, có thể bạn đã nhận ra rằng phương thức này đòi hỏi ta [phải sử dụng "CSS-in-JS"](https://tailwindcss.com/docs/plugins#css-in-js-syntax):

```javascript title=tailwind.config.js
addComponents({
  '.c-btn': {
    textAlign: 'center',
    backgroundColor: `theme('colors.blue.500')`,
    color: 'white',
  },
});
```

Đây là điểm mình hoàn toàn muốn tránh, vì nó trộn lẫn hai cú pháp với nhau và lấy mất đi tất cả các lợi ích của trình soạn thảo và công cụ hỗ trợ mã nguồn cho ngôn ngữ CSS (syntax highlighting, linting). Để giải quyết vấn đề này, ta cần thiết lập thêm một bước trung gian để chuyển đổi mã nguồn CSS sang CSS-in-JS tương ứng.

### Chuyển đổi CSS sang CSS-in-JS

<figure>
	<img src={cssToJssInlineImage} class="mx-auto max-w-full rounded" width="840" height="386" alt="CSS component c-btn được chuyển đổi thành css-in-js bằng postcss-js trong cấu hình plugin Tailwind để sử dụng trong html bằng lớp .c-btn" />
	<figcaption>
    Minh họa 1: quy trình chuyển đổi CSS sang CSS-in-JS để sử dụng trong cấu hình plugin Tailwind
  </figcaption>
</figure>

(1) Mã nguồn cho từng CSS component được đặt trong tệp CSS riêng biệt. Ví dụ với component `c-btn` trên:

```css title=c-btn.css
.c-btn {
  /* ... */
}
```

(2) Sử dụng [postcss](https://postcss.org/) và [postcss-js](https://github.com/postcss/postcss-js) để chuyển đổi các tệp CSS ở bước trước sang cấu trúc phù hợp trong Javscript:

```javascript title=jss-node-loader.js
import { readFileSync } from 'fs';
import postcss from 'postcss';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssJs from 'postcss-js';
import postcssMixins from 'postcss-mixins';

// https://github.com/postcss/postcss-mixins
/** @type {Record<string, import('postcss-mixins').Mixin> } */
const mixins = {};

/**
 * @param {string} filename
 */
function jssLoader(filename) {
  const css = readFileSync(filename, 'utf8');
  const root = postcss.parse(css);

  // áp dụng các postcss plugin thích hợp, ví dụ mixins và custom selectors
  // để tailwind intellisense thể hiện đúng CSS mong muốn
  const jss = postcssJs.sync([postcssMixins({ mixins }), postcssCustomSelectors])(
    postcssJs.objectify(root),
  );

  return jss;
}
```

(3) Áp dụng đầu ra của bước trước vào cấu hình plugin:

```javascript title=tailwind.config.js
import definePlugin from 'tailwindcss/plugin';
// :::diff +
import path from 'path';
import { fileURLToPath } from 'url';
import { jssLoader } from './jss-node-loader';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// :::

const myplugin = definePlugin(function ({ addComponents }) {
  // :::diff -
  addComponents({
    '.c-btn': {
      textAlign: 'center',
      backgroundColor: `theme('colors.blue.500')`,
      color: 'white',
    },
  });
  // :::
  // :::diff +
  addComponents(jssLoader(path.resolve(__dirname, './c-btn.css')));
  // :::
});

// ...
```

### Tối ưu hóa bằng bước build riêng

Như vậy, ta đã có một giải pháp tương đối cân bằng, vừa đảm bảo TailwindCSS language server nhận diện được các CSS component, vừa có thể sử dụng được cú pháp CSS tiêu chuẩn. Giải pháp vừa nêu có thể đáp ứng được hầu hết nhu cầu phổ biến, đặc biệt là đối với các dự án quy mô nhỏ với số lượng component không đáng kể.

Tuy nhiên, khi số lượng component tăng lên, trải nghiệm của lập trình viên sẽ giảm dần cùng với tốc độ phản hồi của build tool (chẳng hạn như [Vite](https://vitejs.dev/)) và TailwindCSS language server, do quá trình đọc tệp và xử lý của hàm `jssLoader` là tương đối phức tạp và lặp lại thường xuyên (được kích hoạt bởi file watcher hoặc hot-module-replacement (HMR)). Để khắc phục điều này, ta có thể thực hiện các tác vụ `jssLoader` trước, xuất thành tệp cố định, và chỉ cần sử dụng lại trong cấu hình plugin tại runtime. Nói cách khác, ta sẽ tạo ra một bước build riêng cho CSS component.

<figure>
	<img src={cssToJssBuildImage} class="mx-auto max-w-full rounded" width="840" height="207" alt="build step riêng giúp lưu kết quả của quá trình chuyển đổi từ CSS sang CSS-in-JS" />
	<figcaption>
    Minh họa 2: kết quả của quá trình chuyển đổi từ CSS sang CSS-in-JS được lưu lại thông qua bước build riêng
  </figcaption>
</figure>

Có nhiều cách để thực hiện bước build này. Bạn có thể tham khảo [mã nguồn của Daisy UI](https://github.com/saadeghi/daisyui/blob/6cbe6a6617b94c6fbee163103b43ee9a27341532/src/build.js), hoặc từ chính [dự án *sveltevietnam.dev*](https://github.com/sveltevietnam/sveltevietnam.dev/blob/da0aa95281da20632a678b88d0a592990cf4d765/libs/ui/css/build.js). Điểm chung của các giải pháp này là sử dụng hệ sinh thái PostCSS tương tự như ta đã thấy tại hàm `jssLoader` đã giới thiệu ở phần trước. Sau đây là một ví dụ đơn giản cho build script:

```javascript title=build.js
import { writeFile } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { jssLoader } from './jss-node-loader';

const __dirname = dirname(fileURLToPath(import.meta.url));

const components = {
  ...jssLoader(resolve(__dirname, './c-btn.css')),
  ...jssLoader(resolve(__dirname, './c-input.css')),
  // ...jssLoader(resolve(__dirname, './c-*.css')),
};

writeFile(
	resolve(__dirname, './components.dist.json'),
	JSON.stringify(components),
	'utf-8',
	(e) => {
		if (e) console.error(e);
	},
);
```

Ta cũng có thể thiết lập npm script để chạy bước build này:

```javascript title=package.json
{
  // ...
  "scripts": {
    // :::diff +
    "build:css": "node ./build.js",
    // :::
  },
  // ...
}
```

Và sử dụng kết quả build trong cấu hình plugin:

```javascript title=tailwind.config.js
import definePlugin from 'tailwindcss/plugin';
// :::diff -
import path from 'path';
import { fileURLToPath } from 'url';
import { jssLoader } from './jss-node-loader';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// :::
// :::diff +
import components from './components.dist.json';
// :::

const myplugin = definePlugin(function ({ addComponents }) {
  // :::diff -
  addComponents(jssLoader(path.resolve(__dirname, './c-btn.css')));
  // :::
  // :::diff +
  addComponents(components);
  // :::
});

// ...
```

Như đã đề cập, bước build riêng giúp cái thiện tốc độ phản hồi trong quá trình phát triển. Tuy nhiên, ta không thể phủ nhận rằng nó cũng làm dự án thêm phần phức tạp và cồng kềnh. Bạn có thể bắt đầu mà không cần bước build, sau đó tái cấu trúc khi dự án đã đủ nhu cầu. Các đặc điểm sau đây có thể giúp bạn nhận biết khi nào nên thêm vào bước build riêng:

- dev server tốn hơn ba giây để phản hồi mỗi lần bạn thay đổi các thành phần liên quan đến cấu hình Tailwind,
- hệ thống thiết kế đã được phát triển tương đối đầy đủ, không cần quá nhiều thay đổi,
- hệ thống thiết kế cần được đóng gói để tái sử dụng cho nhiều dự án khác nhau.

## Đóng gói và tái sử dụng

Đối với mình, lợi ích lớn nhất của giải pháp sử dụng plugin API từ Tailwind là tính độc lập với các logic khác của ứng dụng, giúp ta dễ dàng đóng gói hệ thống thiết kế để tái sử dụng cho nhiều dự án sử dụng chung thiết kế hoặc thành phần giao diện.

<figure>
	<img src={designSystemPackageImage} class="mx-auto max-w-full rounded" width="840" height="467" alt="đóng gói hệ thống thiết kế gồm CSS component, font, màu sắc, và nhiều thiết lập khác để tái sử dụng với bất cứ dự án có sử dụng PostCSS và Tailwind" />
	<figcaption>
    Minh họa 3: đóng gói hệ thống thiết kế và tái sử dụng
  </figcaption>
</figure>

Vì hệ thống thiết kế này chỉ bao gồm các lớp abstraction cơ bản, xây dựng trên CSS và Javascript, ta có thể sử dụng trong nhiều ngữ cảnh khác nhau, với bất cứ framework nào có hỗ trợ PostCSS và TailwindCSS. Trong các ứng dụng nâng cao, ta cũng có thể tích hợp plugin Tailwind trên vào các thư viện giao diện chứa [Javascript component](/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-ii-css-components#javascript-component), tùy theo nhu cầu và framework mà bạn đang sử dụng.

```javascript
import { Header, Footer, ArticleCard } from '@company/design-system/svelte';
import { Playground } from '@company/design-system/react';
// ...
```

Chi tiết để đóng gói mã nguồn trên khá dài dòng và nằm ngoài phạm vi của bài viết này. Nếu bạn đã từng làm việc với các thư viện nội bộ trong một monorepo hoặc xuất bản một thư viện tại [npm](https://www.npmjs.com/) thì cách thực hiện ở đây cũng tương tự. Bạn cũng có thể tham khảo [mã nguồn của @sveltevietnam/ui](https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/libs/ui) - chính là hệ thống thiết kế của *sveltevietnam.dev*, phát triển dựa trên các lý thuyết đã trình bày.

## Tổng kết

Qua ba phần của bài viết "Styling cho Svelte Việt Nam", mình đã giới thiệu sơ bộ về nguyên nhân và cách thức dự án *sveltevietnam.dev* sử dụng TailwindCSS, kết hợp với ý tưởng "CSS component" để xây dựng một hệ thống thiết kế tối giản, đảm bảo tính đóng gói và tái sử dụng, giúp mã nguồn dễ dàng làm quen và khám phá đối cho lập trình viên nhờ sự tương thích với các công cụ hỗ trợ của trình soạn thảo.

Còn rất nhiều khía cạnh của các công cụ trong hệ sinh thái CSS mà ta có thể mở rộng và khai thác. Hy vọng bài viết này không chỉ giúp bạn hiểu thêm về *sveltevietnam.dev* mà còn cung cấp nguồn tham khảo và ý tưởng cho những dự án của riêng bạn. Hệ thống thiết kế của *sveltevietnam.dev* không phải là hoàn hảo và luôn được cải tiến mỗi ngày; những chi tiết thực hiện được giới thiệu trong bài viết có thể sẽ trở nên lỗi thời với tốc độ phát triển của công nghệ ngày nay, nhưng mình tin là những lý thuyết cốt lỗi vẫn luôn có giá trị.

Để thảo luận thêm về chủ đề này, bạn có thể tham gia [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev). Cảm ơn bạn đã theo dõi!
