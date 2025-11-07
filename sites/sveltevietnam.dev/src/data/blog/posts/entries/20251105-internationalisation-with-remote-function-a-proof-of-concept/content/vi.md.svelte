Ngày nay, hỗ trợ đa ngôn ngữ (internationalisation, hay viết tắt là i18n) vẫn còn là một vấn đề được
thảo luận nhiều trong hệ sinh thái Svelte. Hai issue lớn
"[i18n brainstorming][svelte.discussion.brainstorming]" và "[Translations][svelte.discussion.translations]"
vẫn đang mở, và thỉnh thoảng vẫn có những thư viện và ý tưởng mới được đề xuất.
Mình đồng ý với [Rich Harris](https://bsky.app/profile/rich-harris.dev) rằng giải pháp i18n nên được
cung cấp từ thư viện gốc. Tuy nhiên, cho đến khi team Svelte làm được việc đó thì cộng đồng vẫn đóng
vai trò lớn trong việc thúc đẩy và thử nghiệm hướng đến một giải pháp tiêu chuẩn và tối ưu hơn.

Tại [sveltevietnam.dev](https://sveltevietnam.dev), i18n đã trải nhiều phiên bản khác nhau trong
những năm qua. Gần đây, mình đã giành thời gian cải thiện, tối ưu hóa, và thử kết hợp với
[Async Svelte][svelte.await] và [Remote function][sveltekit.remote] là hai tính năng mới đang được
phát triển bởi team Svelte. Bài viết này chia sẽ về kết quả thử nghiệm của mình.

## Code Demo

Giải pháp mình giới thiệu ở đây đã được đóng gói thành thư viện [@sveltevietnam/i18n]. Bạn có thể
thử sử dụng bằng cách làm theo hướng dẫn tại
[@sveltevietnam/i18n > README > Getting Started][@sveltevietnam/i18n.started].

Tóm tắt, bạn có thể sử dụng định dạng ngôn ngữ (locale) sau:

```yaml title=".../locales/en.yaml"
messages:
  just_string: Goodbye!
  some_html: '<strong>Welcome!</strong>'
  string_with_params: Hello {{name}}!
  input:
    # nested keys
    placeholder: Type something here...
  imports:
    from_local:
      '@import': ./path/to/another/locale.yaml
    from_alias:
      '@import': '$lib/components/my-component/locales/lang.yaml'
    from_package:
      '@import': '@design-system/another-component/locales/lang.yaml'
```

Và sử dụng trong một trong những cách dịch sau:

```svelte title="src/routes/.../+page.svelte"
<script lang="ts">
  import { T, Context } from '@sveltevietnam/i18n';
  import * as m from '@sveltevietnam/i18n/generated/messages';

  import { importedCustomRemoteFunction } from './path/to/your/custom/function.remote';

  // expect Context.set or <Provider> somewhere up the tree, see README
  const { t, lang } = Context.get();
</script>

<!-- declarative T component -->
<T key="imports.from_package..." />
<T key="some_html" /> <!-- renders sanitized HTML -->
<T key="string_with_params" params={{ name: 'world' }} />

<!-- imperative t function -->
<input placeholder={await t({ key: 'input.placeholder' })} />

<!-- specifying remote function strategy, similar interface for T or t -->
<T key="..." remote="query" />
<T key="..." remote="prerender" />
<T key="..." remote={importedCustomRemoteFunction} />

<!-- treeshakeable static messages -->
{m['just_string'](lang)}
{m['string_with_params'](lang, { name: 'world' })}
```

## Lưu ý

Thư viện [@sveltevietnam/i18n] được phát triển để hỗ trợ đa ngôn ngữ cụ thể cho các dự án tại Svelte
Vietnam và có thể chưa đáp ứng được tất cả các yêu cầu thực tế trong các dự án khác. Nếu đang
tìm kiếm giải pháp i18n sẵn có nhiều tính năng và đã được sử dụng rỗng rãi hơn, bạn có thể tham khảo
[wuchale.dev][wuchale] hoặc [Paraglide][paraglide].

Ngoài ra, Async Svelte và Remote function vẫn là tính năng thử nghiệm, nên mặc dù mình
có viết test để kiểm tra các tình huống phổ biến, khi sử dụng bạn có thể sẽ gặp phải một
số vấn đề mình chưa đoán trước được. Thư viện này ngoài việc hỗ trợ cho dự án còn là một hình thức để
mình tham gia đóng góp vào đối thoại xung quanh i18n trong hệ sinh thái Svelte.

## Mục tiêu

Nhiệm vụ của [@sveltevietnam/i18n] là thỏa mãn được các tiêu chí sau:

- tính phân bố - kết hợp (composability): có thể viết nhiều tệp locale tại nhiều nơi, dùng ở đâu thì viết tại
  đấy (v.d. tại trang hoặc component), thay vì chỉ có 1 tếp chứa tất cả. Bạn có thể làm được
  điều này với cú pháp `@import` như ví dụ trên.
- hỗ trợ Typescript: khóa (key), tham số (params), v.v - đầu vào và đầu ra về đều có định nghĩa type tương ứng.
- linh hoạt: đánh đổi một số hiệu năng và độ phức tạp để có thể hỗ trợ nhiều cách sử dụng khác nhau,
  v.d như dùng component `<T>` ("declarative" hơn), hoặc hàm `t()` ("imperative" hơn), hoặc sử dụng
  trực tiếp văn bản tĩnh ("static message") khi nằm ngoài ngữ cảnh Svelte (v.d. ở backend).

<div class="c-callout c-callout--info">

Trang bạn đang đọc hiện đang sử dụng thực tế thư viện [@sveltevietnam/i18n] đã nêu.
Bạn có thể và thử thay đổi trang và quan sát network từ devtools để xem remote function
hoạt động và dữ liệu trả về như thế nào.

</div>

## Lợi thế của Remote function

Xử lý dữ liệu i18n bao gốm hai việc chính:

1. định nghĩa các văn bản (message) cần tải, và
2. định nghĩa ngôn ngữ cần tải cho từng văn bản (bản dịch cho văn bản đó).

Hầu hết các giải pháp mình thấy thường bắt bạn phải định nghĩa thủ công cả hai việc trên cho từng
trang, hoặc là tự động tải toàn bộ ngay từ đầu. Trong các dự án lớn và phát triển lâu năm, việc này
dẫn đến khó bảo trì hoặc tải quá nhiều dữ liệu không cần thiết đến người dùng. Thư viện Paraglide
đề xuất giải pháp bằng cách tận dụng ES module và [tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
để tải văn bản khi cần thiết. Mình nghĩ đó là hướng phát triển rất tốt. Tuy nhiên với mỗi văn bản,
Paraglide vẫn sẽ phải tải hết tất cả ngôn ngữ.

Mình nghĩ rằng Remote function sẽ giúp lấp được khoảng trống này. Về lý thuyết, nó sẽ giúp tối ưu hóa
việc tải dự liệu, chỉ tải văn bản và ngôn ngữ cần thiết. Ví dụ, trang sau chỉ tải duy nhất văn bản `hello`
và ngôn ngữ `vi`:

```svelte title="src/routes/vi/+page.svelte"
<script lang="ts">
  import { T } from '@sveltevietnam/i18n';
</script>

<T key="hello" />
```

<div class="c-callout c-callout--info">

Bằng cách này, client bundle sẽ không bị phình to trong dự án lớn. Tuy nhiên, server của bạn sẽ phải
giữ tất cả các bản dịch để tham chiếu tại thời gian thực (runtime) và trả về cho phía người dùng.
Ngoài ra, việc này sẽ bao gôm một số chi phí giao tiếp mạng và đóng gói dự liệu. Hiệu năng và số lượng
dữ liệu thực tế như thế nào khi so sánh với các giải pháp khác vẫn cần được đo đạc và đánh giá thêm.

</div>

## Định nghĩa kiểu Remote function

Thư viện hiện tại hỗ trợ sử dụng hai kiểu remote function,
[query.batch](https://svelte.dev/docs/kit/remote-functions#query.batch) và
[prerender](https://svelte.dev/docs/kit/remote-functions#prerender). Bạn có thể định nghĩa toàn cục
qua context, hoặc cục bộ cho mỗi văn bản, thông qua thuộc tính `remote` như đã nêu tại ví dụ
ở phần [Code Demo](#code-demo). Ngoài ra, bạn có thể cung cấp hàm remote tùy chỉnh tại đây.

`query.batch` sẽ nhóm nhiều yêu cầu (request) thành một để giảm thiểu số lần gọi. Tuy nhiên, `query`
khó tận dụng cache và không sử dụng được trên các trang có bật tính năng `prerender`. Ngược lại,
`prerender` có thể tận dụng cache tốt hơn (CDN cache, browser cache), nhưng sẽ phải gọi một request
cho mỗi văn bản. Sử dụng kiểu remote function nào sẽ tùy thuộc vào từng trường hợp cụ thể của dự án.

## Vite Plugin & Code Generation

Phần lớn công việc để [@sveltevietnam/i18n] có thể hoạt động được như đã nêu là nhờ một Vite plugin.
Plugin này chịu trách nhiệm thu thập tất cả tệp locale tại thời gian build và xây dụng ra các module
chứa văn bản và dữ liệu mô tả cần thiết cho runtime.

```typescript title="vite.config.ts"
import { sveltekit } from '@sveltejs/kit/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    i18n({
      // nơi chứa các tệp locale đầu vào: en.yaml, vi.yaml, v.v
      input: './src/lib/i18n/locales',
      // đầu ra cho các module được tạo tự động, có thể thêm thư mục này vào .gitignore
      output: './src/lib/i18n/generated',
    }),
    sveltekit(),
  ],
});
```

Bạn có thể tham khảo mục [@sveltevietnam/i18n > README > Output Modules][@sveltevietnam/i18n.output]
để biết thêm chi tiết.

## Văn bản tĩnh (Static messages) và Chế độ tĩnh (Static mode)

Trước đây khi chưa có remote function, [@sveltevietnam/i18n] sử dụng giải pháp tương tự Paraglide,
tận dụng văn bản tĩnh được tạo ra khi build. Nếu bạn không thể sử dụng remote function trong dự án
của mình, bạn có thể chuyển sang "chế độ tĩnh" như trước đây này bằng cách thêm `mode: 'static'`
vào cấu hình Vite plugin.

Trong chế độ này, bạn sẽ phải thay thế `key` bằng `message` <- văn bản tĩnh từ sub-module `generated`:

```svelte title="Static Mode"
<script lang="ts">
  import { T, Context } from '@sveltevietnam/i18n';
  import * as m from '@sveltevietnam/i18n/generated/messages';
</script>

<!-- :::diff - -->
<T key="key.to.your.message" /> <!-- báo lỗi Typescript -->
<!-- ::: -->
<!-- :::diff + -->
<T message={m['key.to.your.message']} />
<!-- ::: -->
```

## Tính phân bố và kết hợp (Composability)

Giải pháp i18n tại sveltevietnam.dev được xây dựng từ trước khi [Inlang](https://inlang.com) và
[Wuchale](https://wuchale.dev) trở nên phỗ biến như ngày nay. Một trong những lý do mình muốn xây
dựng giải pháp riêng thay vì sử dụng thư viện đã có sẵn, là để hỗ trợ yêu cầu về tính phân bố và kết
hợp đã nêu. Việc có thể viết tệp locale tại nhiều nơi giúp mình dễ bảo trì và đóng gói thành phần
của dự án. Ví dụ, mình có thể tạo một thư viện trên npm đóng gói locale bên trong, và ở nơi sử
dụng chỉ cần tham chiếu đến tệp locale đó thông qua cú pháp `@import` như đã thấy ở phần [Code
Demo](#code-demo):

```yaml title=".../locales/en.yaml"
messages:
  from_local:
    '@import': ./path/to/another/locale.yaml
  from_alias:
    '@import': '$lib/components/my-component/locales/lang.yaml'
  from_package:
    '@import': '@design-system/another-component/locales/lang.yaml'
```

Bạn có thể tùy chỉnh cho cú pháp và aliases thông qua cấu hình của Vite plugin. Mình hy vọng rằng
khi Svelte hỗ trợ i18n chính thức sẽ bao gồm tính năng tương tự.

## Bên ngoài việc dịch văn bản

Nếu vẽ biểu đồ Venn cho i18n, nó sẽ giao với nhiều vấn đề khác, đặc biệt là routing - làm
sao để tích hợp ngôn ngữ vào đường dẫn (v.d `/en/experiment` cho tiếng Anh, `/vi/thu-nghiem` cho
Tiếng Việt). Các dự án tại sveltevietnam.dev sử dụng một [Vite plugin riêng](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
để giúp tự động hóa một phần công việc routing này. Tuy nhiên giải pháp này vẫn còn đang trong giai
đoạn thử nghiệm và chưa được đóng gói thành thư viện riêng, hoặc tích hợp vào [@sveltevietnam/i18n].

## Phát triển trong tương lai

Có một vài ý tưởng mình muốn thử nghiệm thêm cho [@sveltevietnam/i18n]:

- tối ưu hóa phía server cho chỉ mục văn bản (indexing) để tra cứu nhanh và nhẹ hơn,
- mã hóa văn bản để tăng tính bảo mật,
- tận dụng Vite plugin hoặc Svelte preprocessor để phân tích và thu thập dự liệu sử dụng văn
  bản trong quá trình build, phát hiện văn bản không sử dụng,
- đo lường và kiểm chuẩn (benchmark)


## Kết

Hy vọng thư viện [@sveltevietnam/i18n] sẽ giúp bạn có thêm lựa chọn cho việc hỗ trợ đa ngôn ngữ
trong dự án Svelte của mình. Nếu tìm thấy lỗi hoặc có góp ý, bạn có thể [tạo issue](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) hoặc thảo luận thêm tại [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev).

Cảm ơn bạn đã đọc bài!

[@sveltevietnam/i18n]: https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n
[@sveltevietnam/i18n.started]: https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n#getting-started
[@sveltevietnam/i18n.output]: https://github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n#output-modules
[svelte.discussion.brainstorming]: https://github.com/sveltejs/kit/issues/553
[svelte.discussion.translations]: https://github.com/sveltejs/kit/issues/1274
[svelte.await]: https://svelte.dev/docs/svelte/await-expressions
[sveltekit.remote]: https://svelte.dev/docs/kit/remote-functions
[icu]: https://unicode-org.github.io/icu
[gettext]: https://www.gnu.org/software/gettext

[paraglide]: https://inlang.com/m/dxnzrydw/paraglide-sveltekit-i18n
[wuchale]: https://wuchale.dev
