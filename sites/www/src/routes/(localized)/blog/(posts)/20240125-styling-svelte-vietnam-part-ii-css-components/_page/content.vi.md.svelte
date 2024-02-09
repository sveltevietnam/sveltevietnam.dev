<script>
	import atomicDesignNightmareImage from './images/atomic-design-nightmare.png?format=webp&imagetools';
	import templateBasedDevImage from './images/template-based-development.png?format=webp&imagetools';
	import componentBasedDevImage from './images/component-based-development.png?format=webp&imagetools';
	import atomicDesignComicImage from './images/atomic-design-comic-vi.png?format=webp&imagetools';
	import justChangingColorImage from './images/just-changing-color-vi.png?format=webp&imagetools';
</script>

Bài viết "Styling cho Svelte Việt Nam" được chia làm ba phần, liệt kê sau đây. Bạn đang đọc phần thứ hai.

<div class="not-prose ml-6">
  <ul class="divider-border mt-3 max-w-[548px] divide-y">
    <li>
      <a href="/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-i-tailwindcss" class="c-link c-link--box font-medium">
        <span>Phần I - TailwindCSS</span>
      </a>
    </li>
    <li>
      <a href="/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-ii-css-components" class="c-link c-link--box">
        <span><strong>Phần II - CSS Component</strong></span>
      </a>
    </li>
    <li>
      <a href="/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-iii-kham-pha-va-tai-su-dung-ma-nguon" class="c-link c-link--box">
        <span>Phần III - Khám phá và tái sử dụng mã nguồn</span>
      </a>
    </li>
  </ul>
</div>

---

Trong phần này, mình sẽ giải thích cách *sveltevietnam.dev* tái sử dụng đa số các thành phần giao diện nền tảng chỉ dựa vào CSS, tránh đi sự lệ thuộc không cần thiết vào Javascript mà mình hay thấy trong các dự án web ngày nay. Qua đó, hy vọng bạn có thêm một góc nhìn khác về cách phân tích giao diện và quản lý mã nguồn.

## Javascript Component

Trước khi các framework frontend ra đời, người ta sắp xếp mã nguồn bằng cách tách các tệp HTML ra làm nhiều phần. Khi cần thiết, máy chủ sẽ dán chúng lại, đồng thời đổ dữ liệu vào các vị trí phù hợp trước khi gởi đến trình duyệt.

<figure>
	<img src={templateBasedDevImage} class="mx-auto max-w-full rounded" width="800" height="300" alt="minh họa: tệp page.html được máy chủ ghép thêm các phần từ tệp header.template và footer.template" />
	<figcaption>Minh họa 1: cách phát triển bằng phương pháp tách ghép các tệp mẫu</figcaption>
</figure>

Giải pháp này thường tập trung vào việc đóng gói HTML. Nếu muốn tái sử dụng Javascript hay CSS, ta sẽ phải tự quản lý và đưa vào các tệp `.js`, `.css` phù hợp. Tuy thô sơ, tư duy đơn giản này giúp tách biệt nhiệm vụ của ba công nghệ HTML, CSS, và Javascript:

1. tách ghép các mẫu HTML để định nghĩa cấu trúc của trang,
2. nếu cần tùy chỉnh kiểu dáng, ta nhập tệp CSS tương ứng,
3. khi cần thêm logic để xử lý tương tác người dùng, ta nhập tệp Javascript tương ứng.

Phát triển trên ý tưởng này, các framework frontend ngày nay cung cấp nhiều kỹ thuật giúp tách ghép các bộ phận UI một cách dễ dàng hơn rất nhiều. Các thành phần tách ra hay được gọi chung là "component" (thành phần). Framework giúp ta đóng gói không chỉ HTML mà còn cả CSS và Javascript một cách cục bộ và tương đối độc lập với các component khác; việc tách ghép và nhập các tệp CSS, Javascript cũng sẽ được xử lý tự động.

Giải pháp này thường đòi hỏi Javascript từ framework để biểu hiện ở phía máy chủ (server-side-rendering) hoặc hoạt động ở phía trình duyệt (hydration, client-side-rendering), vì vậy mình hay gọi các component này là "**Javascript component**".

<figure>
	<img src={componentBasedDevImage} class="mx-auto max-w-full rounded" width="840" height="253" alt="minh họa: component được biểu hiện ra trang, chuyển cho trình duyệt, và nâng cao bằng runtime Javascript của framework" />
	<figcaption>Minh họa 2: cách phát triển bằng phương pháp tách ghép giao diện và đóng gói HTML, CSS, JS thành nhiều component</figcaption>
</figure>

Như bạn có thể thấy, mô hình phát triển trên đã trở nên phức tạp hơn rất nhiều so với trước đây. Ranh giới giữa các công nghệ nền tảng đã dần mờ đi, người ta dùng Javascript không phải chỉ để thể hiện logic cho giao diện mà còn làm công cụ trong quá trình phát triển ứng dụng hoặc xử lý dữ liệu từ phía máy chủ (nhờ NodeJS). Điều này không phải là xấu, nhưng hệ quả là đôi khi ta trở nên lệ thuộc vào Javascript với những tư duy cực đoan và thiết kế cồng kềnh không cần thiết.

## Atomic design (thiết kế nguyên tử)

Phân tích và thiết kế thành phần giao diện như thế nào là một chủ đề nóng hổi. Có một bạn từng hỏi mình rằng tại sao mình không ghét gì hết, toàn thấy mình nói gì cũng chung chung nghe như không có chính kiến vậy. Có chứ, một thứ khá ám ảnh đối với mình là "[Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)".

:::div c-callout c-callout--info
Nói đúng hơn mình không ghét lý thuyết "Atomic Design" - nó mang giá trị tham khảo và phát triển tư duy rất cao - mà là ghét cách thực hiện nó. Brad Frost, tác giả của Atomic Design, sử dụng lý thuyết này để xây dựng hệ thống thiết kế (design system). Còn với những gì mình đã thấy từ các dự án thực tế, Atomic Design thay vào đó thường bị lạm dụng để tổ chức mã nguồn và sắp xếp component. Đối với mình, việc này nên gọi là "Atomic Development" thay vì "Atomic Design".
:::

Nói ngắn gọn, các hệ thống áp dụng thiết kế Atomic mình từng thấy có một điểm chung là tư duy đề cao hóa component (component-first), biến mọi thứ thành component, và sắp xếp nó theo các cấp bật: atom (nguyên tử) -> molecule (phân tử) -> organism (tế bào) -> template (mẫu) -> và page (trang). Có thể nói, cách tiếp cận này tượng trưng rất rõ cho thời đại Javascript component.

<figure>
	<img src={atomicDesignNightmareImage} class="mx-auto max-w-full rounded" width="600" height="400" alt="minh họa: thiết kế Atomic theo từng tầng" />
	<figcaption>Minh họa 3: thiết kế Atomic theo từng tầng</figcaption>
</figure>

Ví dụ, một component `ArticleCard` có thể được xây dựng như sau:

```svelte
/// filename=ArticleCard.svelte
<ArticleCard>
	<Link to="/path/to/article">
		<Heading level="3">...</Heading>
	</Link>
	<Figure>
		<Figure.Image src="/path/to/image.png" width="400" height="400" alt="..." />
		<Figure.Caption>...</Figure.Caption>
	</Figure>
	<Description>...</Description>
</ArticleCard>
```

Rất đẹp mắt đúng không nào, trông như ta đang sử dụng một thư viện giao diện đẳng cấp thứ thiệt. Tuy nhiên, để viết được component trên, ta cần viết **sáu component** con: `Link`, `Heading`, `Figure`, `Figure.Image`, `Figure.Caption`, `Description`. Đặc sắc hơn, nếu bạn đã làm việc với web đủ lâu thì có thể đoán được rằng component `Link` được viết như thế nào:

```svelte
/// filename=Link.svelte
<script>
	export let to = '';
</script>

<a class="..." href={to}>
	<slot />
</a>
```

Hay component `Heading`:

```svelte
/// filename=Heading.svelte
<script>
	export let level;
</script>

{#if level === 1}
	<h1 class="..."><slot /></h1>
{:else if level === 2}
	<h2 class="..."><slot /></h2>
{:else if level === 3}
	<h3 class="..."><slot /></h3>
{:else if level === 4}
	<h4 class="..."><slot /></h4>
{:else if level === 5}
	<h5 class="..."><slot /></h5>
{:else if level === 6}
	<h6 class="..."><slot /></h6>
{:else}
	<!-- ??? -->
{/if}
```

Sau đây là một số câu hỏi phát sinh từ ví dụ trên, dựa theo những câu hỏi chính mình đã hỏi hoặc được hỏi bởi đồng nghiệp trong quá trình làm việc với Atomic Design:

- Tại sao trông có vẻ như các component trên chỉ sao chép nguyên bản các phần tử HTML chứ không mang lại tính năng gì đặc biệt?
- Tại sao dùng prop `to` cho component `Link` thay vì `href`?

	:::div c-callout c-callout--info
	Nếu bạn làm việc trong hệ sinh thái React thì sẽ thấy rằng [component `Link` của react-router](https://reactrouter.com/en/main/components/link) dùng `to`, [component `Link` của NextJS](https://nextjs.org/docs/pages/api-reference/components/link) dùng `href`, đâu là đúng?
	:::

- `Figure` nên là atom, là molecule, hay là organism?
- Tại sao `Figure.Image` và `Figure.Caption` cần là component riêng mà không gộp chung vào `Figure`?
- Tại sao không tách `Heading` thành `Heading1`, `Heading2`, hay cụ thể hơn như `ArticleCard.Heading`?
- ...

Giả sử thiết kế viên bảo rằng, tiêu đề (`Heading`) trong `ArticleCard` cần có màu và line-height đặc biệt mà không ở đâu khác có, vậy đúng thật là ta nên tách ra thêm một component `ArticleCard.Heading`. Nhưng ta nên tạo component này bằng cách khai báo một `h3` hoàn toàn mới hay ghi đè lên `Heading` đây?

:::div flex upto-tb:flex-col gap-10

:::div

Ghi đè style lên `Heading`:

```svelte
/// filename=ArticleCardHeading.svelte
<Heading level="3" class="special">
	<slot />
</Heading>

<style>
	:global(.heading.special) {
		line-height: 3.14;
		color: pink;
	}
</style>
```

:::

:::div

Tạo h3 hoàn toàn mới:

```svelte
/// filename=ArticleCardHeading.svelte
<h3>
	<slot />
<h3>

<style>
	h3 {
		line-height: 3.14;
		color: pink;
	}
</style>
```

:::

:::

Một năm sau, khi đồng nghiệp của ta cần dùng `ArticleCardHeading`, nếu không vào đọc mã nguồn, họ sẽ không biết cái heading này nó là level bao nhiêu, vì sao lại phải tách component riêng mà không tái sử dụng `Heading`. Và cứ như thế, hệ thống của bạn sẽ chứa 1001 component lớn nhỏ, đa số component chỉ được dùng tại một vị trí duy nhất trong ứng dụng. Trong một dự án mới, vừa nhìn vào một mẫu thiết kế được giao , anh tech lead liền triệu tập một cuộc họp bất thường gọi hẳn mười dev vào phòng họp, dành ba tiếng phân tích để xác định nên tạo ra bao nhiêu component, cái nào là organism/molecule/atom, ...

<figure>
	<img src={atomicDesignComicImage} class="mx-auto max-w-full rounded" width="800" height="645" alt="minh họa: trải nghiệm dev khi dùng thiết kế Atomic" />
	<figcaption>Minh họa 4: tóm tắt trải nghiệm của mình khi tiếp cận thiết kế Atomic</figcaption>
</figure>

## Component là gì?

Các bạn dev rất thích sử dụng thuật ngữ "seperation of concerns", tạm dịch là tách biệt mã nguồn theo nhiệm vụ. Trong các ví dụ trên, HTML (cấu trúc) và CSS (kiểu dáng) đã bị lồng ghép vào nhau. Việc một đoạn văn bản mang ngữ nghĩa h3, và việc nó có màu sắc và đường nét thể nào là hai việc tương đối độc lập. Vậy tại sao ta lại gói gọn cả hai vào chung một component? Nếu yêu cầu rằng ta phải dùng `h3` nhưng kiểu dáng lại tương ứng với `heading-2` trong hệ thống thiết kế, thì ta phải tạo ra những thủ thuật tạm bợ, thay đổi abstraction đã có để phục vụ nhu cầu mới, và tranh cãi cách nào là đúng.

<figure>
	<img src={justChangingColorImage} class="mx-auto max-w-full rounded" width="800" height="491" alt="designer bảo dev đổi màu văn bản chỗ này thôi. Dev bảo sao chị không giết em luôn đi ạ" />
	<figcaption>Minh họa 5: yêu cầu có thể thay đổi liên tục, abstraction thì không!</figcaption>
</figure>

Component là gì? Đối với mình, component có hai mục đích, để sắp xếp mã nguồn, hoặc để tái sử dụng. Nếu cách làm trên là để sắp xếp mã nguồn, thì nó là giải pháp khá tệ, vì mỗi component chỉ có vài dòng, và nó đi trừu tượng hóa các phần tử cơ bản của HTML như `a`, `p`, `img`, như là viết lại nền tảng web vậy. Thế còn để tái sử dụng thì sao? Cũng khá tệ, vì rất nhiều component chỉ được sử dụng có một lần bên trong một component khác. Hơn nữa, cái ta cần tái sử dụng hầu hết là kiểu dáng, là CSS, còn các thuộc tính khác đều phải biến đổi tùy ngữ cảnh của ứng dụng.

Nói tóm lại, Javascript component đôi khi tạo nên những lớp abstraction cồng kềnh và thật sự không cần thiết, đặc biệt là khi kết hợp với việc lạm dụng Atomic Design một cách mù quáng.

## CSS Component

Bạn nghĩ rằng giao diện ô văn bản sau đây có cấu trúc HTML như thế nào, cần bao nhiêu div hay component con?

<p class="c-callout c-callout--info">
  Giao diện được dùng để làm nổi bật một đoạn văn bản với ngữ nghĩa bổ sung thông qua màu sắc tương ứng.
</p>

Đây là mã nguồn cho giao diện trên:

```svelte
<p class="c-callout c-callout--info">
  Component [...] màu sắc tương ứng.
</p>
```

Hãy phân tích một tí: tất cả các yếu tố xác định kiểu dáng của giao diện trên đều được định nghĩa thông qua lớp `c-callout` và `c-callout--info`. Bạn có thể xem [mã nguồn `c-callout` tại đây](https://github.com/sveltevietnam/sveltevietnam.dev/blob/7688ef2d653be7bda0138465242ee928a42794ab/libs/ui/css/components/c-callout.css). Mình gọi `c-callout` là một "**CSS component**", có nghĩa là một thành phần giao diện được thiết lập chỉ với CSS.

Ta không cần phải tạo ra một Javascript Component `Callout.svelte` vì giao diện này không đòi hỏi markup đặc biệt gì (ví dụ bắt buộc phải là thẻ `p`), và cũng không chứa logic đặc biệt gì. Tất cả mọi thứ ta cần đóng gói là kiểu dáng, và ta đã làm được điều đó bằng CSS. Hãy thử viết lại component `ArticleCard` ở phần trước với ý tưởng tương tự xem nào:

```svelte
/// filename=ArticleCard.svelte
<article>
  <a href="/path/to/article" class="c-link">
    <h3 class="c-text-h2">...</h3>
  </a>
  <figure class="c-figure c-figure--image">
    <img src="/path/to/image.png" width="400" height="400" alt="..." />
    <figcaption>...</figcaption>
  </figure>
  <p>...</p>
</article>
```

Ta không còn có những component con nữa, tất cả đều là các phần tử HTML cơ bản, và những thành phần cần tái sử dụng đều đã được đóng gói thông qua những CSS component tương ứng. Hãy chú ý rằng, nhờ chỉ đóng gói CSS, ta đã đảm bảo tính "separation of concerns" tại phần tử tiêu đề: kiểu dáng là `h2`, nhưng ngữ nghĩa văn bản là `h3`:

```svelte
<h3 class="c-text-h2">...</h3>
```

Tại phần tử `figure`, ta còn có thể lượt bỏ lớp điều chỉnh `c-figure--image` bằng cách tận dụng tính năng mới của CSS là [:has](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) selector:

```css
.c-figure {
  /* :::highlight */
  &:where(:has(img)) {
    /* c-callout--image */
  }
  /* ::: */
}
```

:::div c-callout c-callout--info
Chú ý ta dùng [:where](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) để kiểm soát [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) của selector này để có thể ghi đè lên tùy vào trường hợp cụ thể. Đây là kỹ thuật phổ biến đặc biệt hay gặp trong các thư viện CSS.
:::

Cách tư duy ưu tiên CSS như thế này hoàn toàn **không** mới. Đây là cách người ta viết giao diện trước khi các framework frontend ra đời. Hóa ra, cách người ta viết giao diện hơn mười năm trước thật đáng học hỏi quá đúng không nào!

## Chiến lược phân tách giao diện

Đây là một số nguyên tắc tổng quát tại *sveltevietnam.dev* khi phân tích thành phần giao diện cho việc tái sử dụng (không bàn đến mục điểm sắp xếp mã nguồn):

- Một giao diện có thể tách thành component để tái sử dụng chỉ khi nó được sử dụng quá ba lần ([Rule of Three](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming))).
- Nếu thành phần chỉ đóng gói kiểu dáng, tạo CSS component. Đa số những thành phần giao diện cơ bản tại *sveltevietnam.dev* là CSS component: `c-text-...`, `c-btn`, `c-link`, `c-input`, `c-tag`, `c-loader`, ...
- Nếu thành phần đòi hỏi markup cụ thể hoặc chứa logic đặc biệt, *cân nhắc* tạo Javascript component. Ví dụ cho trường hợp này tại *sveltevietnam.dev* là `Breadcrumbs`, `BlogPostItem`, `SplitText`, ...

Bằng cách bỏ đi những abstraction nặng nề, mã nguồn của *sveltevietnam.dev* đã trở nên gọn gàng hơn, dễ đọc, bảo trì, và linh hoạt hơn.

## Tạm kết

Tạm gác lại bài viết tại đây, tổng kết rằng Javascript component là phương pháp phát triển rất tiện lợi nhưng ta nên xác định rõ nhu cầu và lợi, hại khi đóng gói một thành phần giao diện, ưu tiên tính đơn giản và tránh những abstraction không cần thiết. Ngày nay CSS đã trưởng thành nhiều, bạn hãy thử tận dụng nó để giảm đi phần nào sự lệ thuộc vào Javascript nhé!

Trong phần tiếp theo và cuối cùng, "[Styling cho Svelte Việt Nam: phần III - khám phá và tái sử dụng mã nguồn](/vi/blog/20240125-styling-cho-svelte-viet-nam-phan-iii-kham-pha-va-tai-su-dung-ma-nguon)", mình sẽ kết nối Tailwind từ phần trước với tư duy CSS component trong phần này, và giải thích cụ thể hơn cách *sveltevietnam.dev* thiết lập CSS component như thế nào. Hãy tham gia [Discord của Svelte Việt Nam](https://discord.sveltevietnam.dev) để thảo luận thêm về bài viết. Xin cảm ơn!
