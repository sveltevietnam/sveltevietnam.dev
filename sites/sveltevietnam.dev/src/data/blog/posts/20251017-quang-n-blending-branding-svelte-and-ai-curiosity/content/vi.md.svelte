<script>
  import { ChatContainer, ChatItem } from '$lib/components/chat';
  import { loadParticipants } from '$lib/components/chat/utils';
  import { Contexts } from '@sveltevietnam/kit/contexts';

	const { routing } = Contexts.get();
  const participants = loadParticipants(['liti-dev','quang-design'], routing.lang);
</script>

Quang là một người điềm tĩnh, bình thản - kiểu người không vội vàng lên tiếng - nhưng khi đã nói, thì đó là những lời rất sâu sắc.
Quang hiện tại là Design Director. Công việc của anh vượt xa yếu tố thẩm mỹ và thiên về nhận diện thương hiệu.

## Hỏi nhanh đáp gọn

<ChatContainer class="py-2 *:max-w-4/5 flex flex-col mobile:gap-2" participants={participants}>
<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Bạn biết đến Svelte hoặc cộng đồng này như thế nào?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> Mình đang tìm một framework nhẹ để xây dựng các web app nhỏ. Cú pháp rõ ràng và tốc độ của Svelte khiến mình ấn tượng ngay lập tức. Nó đơn giản, tinh tế và dễ tiếp cận.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Một điều thú vị về bạn?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> Hiện mình đang làm giám đốc thiết kế tại một startup (FlexOS), nhưng mình cũng hoàn thành khóa học lập trình fullstack và NLP.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Hiện tại bạn đang làm dự án gì?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> Mình đang xây dựng <a href="https://www.quang.design/engineer" rel="noopener">các ứng dụng Svelte nhỏ</a> sử dụng API LLM và tạo website cá nhân. Gần đây, mình cũng bắt đầu khám phá mảng bảo mật trong SvelteKit, như làm việc với security headers.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Bạn debug ứng dụng Svelte như thế nào?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> `console.log` khắp nơi 😄 + hỏi LLM khi bí

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Setup Svelte dev của bạn là gì?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> MacOS, Windsurf IDE, Tailwind CSS.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Khái niệm khó nhất?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> Chắc chắn là Context API. Mình mất kha khá thời gian để thật sự hiểu cách nó hoạt động.

</ChatItem>

<ChatItem participant="liti-dev">

<span class="sr-only">Câu hỏi:</span> Bạn muốn thấy thêm điều gì từ cộng đồng?

</ChatItem>
<ChatItem participant="quang-design" align="right">

<span class="sr-only">Trả lời:</span> Mình rất muốn thấy những thử thách nhỏ - nơi mọi người học bằng cách làm dự án gì đó. Gửi lời cảm ơn đến <a href="/vi/con-nguoi/vnphanquang">Quang Phan</a> vì đã chào đón mình vào cộng đồng dù mình không phải là dev. Sự tử tế đó thật sự đáng quý.

</ChatItem>
</ChatContainer>

Trong thời đại mà AI ngày càng làm mờ ranh giới giữa các chức danh công việc, thật dễ để nhận ra những người như Quang: luôn hướng đến việc tạo ra những sản phẩm vừa đẹp vừa hiệu quả. Anh không chỉ là một nhà thiết kế biết lập trình hay một lập trình viên biết thiết kế. Anh có thể cân cả hai.

<div class="c-callout c-callout--success c-callout--icon-confetti">
Bên trong vẻ ngoài trầm lặng ấy là một tâm trí tò mò, luôn háo hức thử nghiệm, học hỏi và xây dựng.
</div>



## Tài liệu Quang N. gợi ý

- [Khóa Svelte 5 trên Udemy](https://www.udemy.com/course/practical-sveltekit-guide-build-and-deploy-real-world-apps/)
- [Joy of Code](https://joyofcode.xyz/)
- [Huntabyte](https://www.youtube.com/@Huntabyte)
- [Ben Davis](https://www.youtube.com/@bmdavis419)
