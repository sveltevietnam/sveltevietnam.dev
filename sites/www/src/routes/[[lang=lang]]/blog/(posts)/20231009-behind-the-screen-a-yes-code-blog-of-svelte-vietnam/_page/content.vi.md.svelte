<script lang="ts">
  import authorsImg from './images/authors.webp';
  import confusedManImg from './images/confused-man.webp';
  import creativePaperImg from './images/creative-paper.webp';
  import ctaWriteImg from './images/cta-write.webp';
  import hardcodedDataImg from './images/hardcoded-data.webp';
</script>

Khi ghé thăm Blog của Svelte Việt Nam, có thể bạn đã tự hỏi rằng các bài viết ở đây được đăng và lữu trữ như thế nào. Có thể bạn cũng đã thấy rằng trang web Svelte Việt Nam không có hệ thống đăng nhập hay quản lý người dùng. Hãy nghĩ thử xem: các nền tảng viết blog (nổi tiếng nhất là Wordpress), hay mạng xã hội (Facebook, Twitter, Instagram, …) đều phải đi qua bước đăng nhập và một trình biên tập (editor) riêng biệt. Vậy bài viết của Svelte Việt Nam thì sao?

Câu trả lời là Blog của Svelte Việt Nam (từ đây sẽ gọi tắt là Blog) không cần đăng nhập, không có một editor đặc thù nào. Nói ngắn gọn, Blog là một trang web tĩnh (static), mỗi bài viết là những dòng code cứng được viết bằng tay và lưu trữ tại [Github](https://github.com/sveltevietnam/sveltevietnam.dev). Bằng cách này, chúng ta đã giản lược đi gánh nặng về hạ tầng và một số giới hạn kỹ thuật. Đương nhiên, bên cạnh đấy thì thiết kế này cũng khiến người viết blog truyền thống khó tiếp cận hơn và tạo ra những thử thách mới về quy trình.

Trong bài viết này, chúng ta sẽ bàn luận cụ thể hơn về những lợi ích và khó khăn vừa nêu.

## Các cách đăng bài

Trước khi đi sâu hơn, hãy cùng nhìn qua các cách đăng bài hiện tại:

1. [Gởi đề xuất đăng bài](https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog%2Cblog%3Apending&projects=&template=vi_blog_post_proposal.yaml&title=%C4%90%E1%BB%81+ngh%E1%BB%8B+%C4%91%C4%83ng+b%C3%A0i%3A+%3Ct%E1%BB%B1a+%C4%91%E1%BB%81+b%C3%A0i+vi%E1%BA%BFt%3E): người viết gởi chi tiết bài viết thông qua mẫu đơn Github issue. Nội dung được duyệt bởi ban quản trị và sau đó kỹ thuật viên sẽ tiến hành code bài vào hệ thống.
2. Code trực tiếp bài viết: người viết chủ động làm kỹ thuật viên cho bài viết của chính mình, sau đó đề nghị phê duyệt thông qua Github pull request.

Ngoài ra, người viết còn có thể [gởi yêu cầu liên kết bài viết liên quan đã đăng từ các nền tảng khác](https://github.com/sveltevietnam/sveltevietnam.dev/issues/new?assignees=vnphanquang&labels=page%3Ablog%2Ccontent%3Ablog&projects=&template=vi_external_blog_post_link_request.yaml&title=Li%C3%AAn+k%E1%BA%BFt+b%C3%A0i+vi%E1%BA%BFt+ngo%C3%A0i%3A+%3Ct%E1%BB%B1a+%C4%91%E1%BB%81+b%C3%A0i+vi%E1%BA%BFt%3E), hoặc liên hệ trực tiếp với ban quản trị thông qua [Discord](https://discord.sveltevietnam.dev/) hoặc hòm thư [blog@sveltevietnam.dev](mailto:blog@sveltevietnam.dev).

## Người viết. Người code

<img
  src={authorsImg}
  alt="authors"
  loading="lazy"
  decoding="async"
  class="tb:w-[570px] mx-auto rounded h-auto max-w-full"
  height="320"
  width="570"
/>

Chúng ta thấy rằng thiết kế hạ tầng và hai cách đăng bài chính nêu trên đều hướng đến người viết có kiến thức về công nghệ, ít nhất là có thể thao tác với Github. Ta chưa có đủ dữ liệu để biết rằng giải pháp này có hiệu quả hay không, nhưng với suy nghĩ rằng thành viên của cộng đồng Svelte Việt Nam đa số là lập trình viên thì các thao tác trên có lẽ đã là một phần quen thuộc của công việc hằng ngày. Vì vậy, tuy quy trình đăng bài này là mới so với các giải pháp truyền thống (đăng nhập, đăng bài qua rich text hoặc user-interface-based editor), hy vọng rằng người viết sẽ nhanh chóng làm quen và cảm nhận được sự tự do mà Blog mang lại.

Cụ thể hơn nữa, (1) sẽ giúp thành viên tiếp cận dần vào quy trình và cách làm việc điển hình của một dự án mã nguồn mở (open source) thông qua việc giao tiếp bằng Github là một nền tảng quản lý dự án phần mềm phổ biến. Bên cạnh đó, (2) sẽ giúp thành viên đào sâu vào mã nguồn của Svelte Việt Nam, khuyến khích các kỹ năng đọc hiểu code và đóng góp chủ động hơn trong một dự án quy mô trung bình.

Đương nhiên chúng ta cũng nên thừa nhận là người viết vẫn phải đăng nhập vào Github hoặc Discord (hoặc vào đâu đấy để gởi được email). Tuy nhiên, những nền tảng này khá phổ biến và chúng ta có thể giả định có cơ sở là sử dụng các nền tảng đấy sẽ tiện hơn là đăng ký và đăng nhập vào một hệ thống mới.

## Cao tầng. Hạ tầng

Trong giai đoạn phát triển của thế giới phần mềm qua thập kỉ vừa rồi, con người đã nghĩ ra nhiều giải pháp để *che đi phần nào sự phức tạp* của chương trình máy tính thông qua giao diện đồ họa (graphical user interface, GUI). GUI không phải là mới, nhưng nó đã thành xu thế và phổ biến hơn rất nhiều so với giao diện văn bản (text-based user interface, TUI) nhờ vào tính trực quan và dễ tiếp cận của nó, đặc biệt là với người dùng phổ thông. Thay vì làm nên một trang web bằng HTML, CSS, Javscript, người ta sẽ dùng Wordpress và các plugin của nó để làm mọi chuyện. Nhà thiết kế giao diện và đồ họa có thể sử dụng Dreamweaver, Wix, và nhiều công cụ khác để phần nào thay thế cả kỹ thuật viên. Và thay vì phải tuyển một đội IT, nhiều tập đoàn đã sử dụng dịch vụ của Salesforce hay ServiceNow. Các giải pháp này, mình xin được tạm gọi chung là “no-code”, có nghĩa là không đòi hỏi người dùng phải biết nhiều về lập trình và kỹ thuật.

Chúng ta không thể phủ nhận được giá trị mà các giải pháp no-code đã mang lại. Nhờ nó mà người dùng đã có thể tiếp cận đến nhiều phần mềm hơn bao giờ hết. Tuy nhiên, mình sử dụng cụm từ “*che đi sự phức tạp*” ở trên vì sự phức tạp nó vẫn ở đấy thôi. Vẫn phải có các kỹ thuật viên xây nên và bảo trì các hệ thống như Wordpress, Wix, ServiceNow. Hãy nghĩ xem nào, bây giờ nếu bạn muốn xem thử trong cây thư mục của bạn có tập tin gì, thay vì gõ lệnh `ls` hay `dir` trong command line để nhận về một danh sách các tập tin, bạn sẽ mở các trình giao diện như file explorer, finder, … và để cho CPU, GPU của bạn vẽ ra những ô pixel tròn, vuông, tam giác nhiều màu sắc. Thế là thay vì sự phức tạp nằm ở việc đòi hỏi user nhớ câu lệnh và đọc văn bản, ta chuyển sự phức tạp đấy sang các nhà phát triển hệ điều hành để vẽ được lên những thứ đấy (và cả đội ngũ thiết kế để quyết định nên vẽ màu gì, vẽ cái gì). Và đặc biệt rằng chúng ta vẫn đòi hỏi người dùng nhấn vào nơi nào đấy để vẽ được cây thư mục này. Ở ví dụ khập khiểng và cục bộ vừa rồi, có thể nói rằng thập chí ta đã tạo ra nhiều sự phức tạp hơn là che đậy sự phức tạp ban đầu.

<img
  src={confusedManImg}
  alt="confused man"
  loading="lazy"
  decoding="async"
  class="tb:w-[570px] mx-auto rounded h-auto max-w-full"
  height="320"
  width="570"
/>

Có lẽ vì các lập trình viên phải nhớ câu lệnh `ls` và nhớ cả phần mềm file explorer để làm cùng một việc, và nhiều nhiều nhiều thứ tương tự như thế nữa, dần dần họ đã bị tẩu hỏa nhập ma và nghĩ là mọi thứ đều phải phức tạp hơn nữa. Thay vì xây dựng một trang blog tĩnh, ta sẽ làm một hệ thống cao tầng khổng lồ bao gồm tất cả các công nghệ đương thời, một quy trình chứa tất cả các bước, frontend, backend, testing, database, docker, kubernetes, chỉ để phục vụ cho vài người dùng mỗi tháng, trong đó có chính ta với ba trình duyệt khác nhau (là ba người dùng rồi 😆).

Thế thì nếu Wordpress là “no-code”, thì Blog của chúng ta là “yes-code”, xuất phát từ những tư duy trên. Nếu đa số người viết đều là lập trình viên - những người đã biết dùng câu lệnh `ls` - thì ta che đi sự phức tạp cho ai nữa. Nếu ta biết rằng việc tự tay code lên một bài viết là nhanh chóng, dễ dàng, và tự do thì đâu cần một hệ thống quản lý nội dung (content management sysytem, CMS) để làm gì. Bằng cách giảm đi các lớp đậy (abstraction), ta không phải phóng đại thêm sự phức tạp đã có cho ban quản trị trong việc bảo trì hệ thống và chi trả cho hạ tầng. Mã nguồn cũng sẽ dễ tiếp cận hơn vì bây giờ bạn chỉ cần chạy vài câu lệnh là có được cả hệ thống, thay vì phải giả lập hạ tầng bằng các dịch vụ thứ ba. Và cuối cùng, người viết, hay người code, có thể đi code và đi viết, thay vì đi làm quen với một editor khác, với những cái nút và tính năng mới lạ mà khi nhấn vào thì cả hệ thống vỡ hết vì nhà phát triển editor “không có thời gian để tính đến trường hợp đấy” như họ hay nói trong các buổi giải trình lý do bug cho product owner.

<svg inline-src="./images/tech-and-bug" class="my-8 mx-auto max-w-full w-[320px] h-auto" />

## Đến đâu thì lo đến đấy

Vậy vấn đề là gì khi xây dựng Blog trên một hạ tầng đơn giản, thiếu đi các lớp abstraction phổ biến như vậy?

**Một** là tình trạng lặp code. Một số đoạn code mang tính thiết lập (setup) hay lưu trữ dữ liệu sẽ bị lặp lại mỗi lần một bài viết được tạo ra. Thay vì gói gọn thông tin của bài viết thành cấu trúc dữ liệu, ta phải lưu chúng bằng code cứng.

<img
  src={hardcodedDataImg}
  alt="hard-coded data"
  loading="lazy"
  decoding="async"
  class="w-full h-auto mx-auto rounded"
  height="320"
  width="570"
/>

Điều này có thể làm ta mất đi tính nhất quán trong dữ liệu giữa nhiều bài viết. Nếu có thay đổi về sau, việc sửa đổi (refactor) sẽ tốn nhiều thời gian hơn. Hiện nay, Blog sử dụng [hygen](http://www.hygen.io/) làm công cụ tự động hóa một phần quy trình khởi tạo bài viết mới, giúp giữ được tính đồng nhất ban đầu. Ngoài ra [MDSvex](https://github.com/pngwn/MDsveX) được thiết lập để tận dụng cú pháp Markdown cho nội dung bài viết, giúp giản lượt các đoạn code HTML đơn giản và phổ biến.

**Hai** là việc thiếu những thành phần (component) có sẵn. Một editor thường sẽ cho bạn trước những tính năng phổ biến như chèn đường dẫn, hình ảnh, video, bản biểu, … Những thứ này không hoặc chưa có sẵn tại Blog. Điều này là có chủ đích, đơn giản vì nhu cầu chưa phát sinh. Trong quá trình phát triển của Blog, các đoạn code được sử dụng nhiều lần sẽ trở thành những component chung để người viết sau tái sử dụng. Thay vì một nguời làm component để nhiều người dùng, chúng ta hãy thử mỗi người làm component của riêng mình, sau đó ngồi lại và tìm điểm tương đồng để tạo nên những component chung.

Bên cạnh đó, ngoài văn bản “**[Blog Post: Implementation Guidelines](https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md#blog-post-implementation-guidelines)”**, bạn sẽ không tìm thấy một hướng dẫn chi tiết hay quy định cụ thể nào cho bài viết. Dần dần khi dự án lớn lên, sẽ có những quy tắc tối thiểu buộc phải sinh ra để bảo đảm tính đồng nhất và hiệu quả của quy trình đăng bài. Tuy nhiên chúng ta sẽ luôn cố gắng không kiềm lấy sức sáng tạo. Nói cách khác, mỗi bài viết là một tờ giấy trắng, sẽ có những bài viết trước để bạn tham khảo, nhưng code gì hay viết gì là phụ thuộc vào bạn.

<img
  src={creativePaperImg}
  alt="creative blank paper"
  loading="lazy"
  decoding="async"
  class="tb:w-[570px] mx-auto rounded h-auto max-w-full"
  height="320"
  width="570"
/>

## Cho tôi một ít sự phức tạp

May mắn là, chung ta đang dùng Svelte. Với cú pháp đơn giản và tương đồng với các công nghệ thuần túy (HTML, CSS, Javascript), người viết sẽ cảm thấy gần gũi hơn khi phải chạm tới những dòng code. Các thư viện và nền tảng cũng đã trở nên tốt hơn rất nhiều trong việc tối ưu hóa năng suất của nhà phát triển. Chúng ta dùng Typescript để có thêm những tính năng bổ trợ cho Javascript, ta dùng Tailwind để viết CSS “nhanh” hơn, và ta dùng Cloudflare để hiện thực hóa hạ tầng một cách nhanh chóng, tiện nghi, và bảo mật. Đằng sau những công nghệ đó là rất nhiều sự phức tạp và những con người đáng học hỏi. Vì vậy, nếu bạn vẫn đam mê một ít phức tạp trong cuộc đời mình, hãy dành thời gian tìm hiểu và đóng góp vào những cộng đồng, công nghệ đó nhé!

## Tổng kết

Nói tóm lại, Blog của Svelte Việt Nam là một nền tảng “yes-code”, mỗi bài viết là những dòng code cứng bằng tay được lưu trữ tại Github. Chúng ta không có editor, không có CMS, không cần một hạ tầng khổng lồ. Lý do là chúng ta vẫn chưa có nhu cầu cho những thứ quy mô lớn đấy. Đơn giản và sáng tạo là yếu tố chính mà mình đề cao tại Blog. Hãy viết bài nếu có thể, và cho mình xin những phản hồi, ý kiến đóng góp nhé.

<img
  src={ctaWriteImg}
  alt="let's write"
  loading="lazy"
  decoding="async"
  class="tb:w-[570px] mx-auto rounded w-auto max-w-full"
  height="360"
  width="540"
/>
