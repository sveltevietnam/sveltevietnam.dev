<script>
  import { ChatContainer, ChatItem } from '$lib/components/chat';
  import { loadParticipants } from '$lib/components/chat/utils';
  import { SettingsContext } from '$lib/settings/context.svelte';

  import summarizer from '../images/summarizer.png?format=avif';

  const settings = SettingsContext.get();
  const participants = loadParticipants(['liti-dev', 'trongnguyen24'], settings.language);
</script>

Lần đầu trò chuyện với Nguyên, mình ấn tượng bởi hai điều: sự khiêm tốn và nhiệt huyết ẩn sau từng câu chữ. Có một sự chân thành rõ nét trong cách anh nói về thiết kế, lập trình, và cộng đồng Svelte. Đó chính là kiểu năng lượng khiến mình nhớ rằng: **công nghệ, suy cho cùng, vẫn luôn mang đậm yếu tố con người**.

Nguyên xuất thân không phải là dân lập trình.

> Lúc đó mình chỉ biết HTML/CSS và đang tìm một công cụ nào đó giúp biến thiết kế của mình thành một trang web thực sự.

Và “công cụ nào đó”, hóa ra lại là Svelte. Nhờ một video từ kênh Fireship (mình cũng là một fan cuồng), Nguyên bắt đầu hành trình với Svelte và chưa hề hối tiếc vì lựa chọn này. Sự đơn giản trong cú pháp, thân tiện với người dùng, hoàn toàn phù hợp với tư duy sáng tạo của anh:

> Cảm giác như đang làm việc với JavaScript, HTML và CSS thuần vậy.

## Hỏi nhanh đáp gọn

<ChatContainer class="py-2 *:max-w-4/5 flex flex-col mobile:gap-2" participants={participants}>
<ChatItem participant="liti-dev">

<span class="sr-only">Hỏi:</span> Một điều thú vị về bản thân?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Đáp:</span> Mình có thể mày mò đọc tài liệu để xây dựng một trang web hoặc ứng dụng, nhưng thú thật là mình không hẳn là một người biết JavaScript. Điều này cũng chứng tỏ rằng Svelte rất dễ sử dụng đúng không?

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Hỏi:</span> Miêu tả hành trình với Svelte bằng một biểu tượng 🙂

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Đáp:</span> 🔥Nhờ có Svelte, niềm đam mê làm web trong mình đã bùng cháy mạnh mẽ.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Hỏi:</span> Nếu có thể, bạn sẽ chọn lập trình chung với ai?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Đáp:</span> Câu hỏi này khó quá! Mình ngưỡng mộ rất nhiều người trong lĩnh vực UI/UX, lập trình và 3D, nhưng thường thì mình làm việc một mình. Tuy nhiên, nếu phải chọn, mình sẽ chọn [Adam Argyle](https://nerdy.dev/).

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Hỏi:</span> Phương pháp debug

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Đáp:</span> Lúc nào cũng mở tab Svelte docs, hỏi và thảo luận với Gemini, Chrome devtools AI assistance, Cline 😑.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Hỏi:</span> Khái niệm khó nhất của Svelte?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Đáp:</span> Chắc là mấy khái niệm Runes, vì mình đã quen với khai báo biến đơn giản của Svelte 4. Chắc do mấy cái mình làm chỉ xoay quanh mấy cái cơ bản nên chưa đụng tới mấy chỗ khó nhằn.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Hỏi:</span> Đoạn code nào gần đây của Svelte mà bạn thích?

</ChatItem>
<ChatItem participant="trongnguyen24" align="right">

<span class="sr-only">Đáp:</span> Cái [#key](https://svelte.dev/docs/svelte/key) này làm hiệu ứng biến ra biến vô khi chuyển trang rất là dễ

```svelte title="#key block"
{#key data.pathname}
	<PageTransition/>
{/key}
```

</ChatItem>

</ChatContainer>

Không cần nói cũng thấy Nguyên là người khá linh hoạt và biết cách giải quyết vấn đề. Anh từng bảo rằng mình “không rành JavaScript cho lắm”, vậy mà lại mày mò làm hẳn một tiện ích Chrome mang tên [Summarizerrrr](https://github.com/trongnguyen24/Summarizerrrr) giúp tóm tắt video YouTube, bài viết Reddit, và nhiều thứ khác nữa. Ý tưởng này xuất phát từ một nhu cầu rất thật: tiết kiệm thời gian cho chính mình.

<figure>
  <img src={summarizer} class="mx-auto max-w-full" width="573" height="376" alt="minh họa: tiện ích summarizer" />
  <figcaption>Tiện ích Summasizerrrr</figcaption>
</figure>

<div class="c-callout c-callout--success c-callout--icon-trophy">
Nguyên giống như một đốm sáng lặng lẽ trong bức tranh đầy màu sắc của cộng đồng Svelte. Không cần hoàn hảo, nhanh gọn, chỉ kiên trì đóng góp và học hỏi không ngừng.
</div>

Chúng ta ai cũng có thể học được điều gì đó từ tinh thần ấy.

## Nguồn tài liệu yêu thích của Nguyên

- [Google’s guide to modern web development](https://web.dev/)
- [UI/UX philosophy and techniques](https://rauno.me/craft)
- [Web Interface Guidelines](http://interfaces.rauno.me)
- [Nerdy.dev](https://nerdy.dev/) – Modern CSS tips from Adam Argyle
- [Josh W Comeau](https://www.joshwcomeau.com/) – Great deep dives into Flex, Grid, and frontend magic

<div class="c-callout c-callout--success c-callout--icon-confetti">

Ủng hộ Nguyên bằng cách dùng thử tiện ích và đánh sao cho repo này

👉 [Summarizerrrr on GitHub](https://github.com/trongnguyen24/Summarizerrrr) <br />
👉 [Summarizerrrr on Chrome Web Store](https://chromewebstore.google.com/detail/summarizerrrr/ahfjndakflcegianjdojpldllodpkkpc)

</div>
