Svelte Việt Nam là gì? Đến từ đâu? Và vì sao phải cần tới nó? Cùng mình tìm câu trả lời trong bài viết này nhé!

## Duyên khởi

Dự án Svelte Việt Nam được mình khởi tạo vào tháng 12 năm 2022. Trước đó gần hai năm, mình đến với Svelte một cách tình cờ khi đang tìm kiếm các công nghệ mới để cải tiến một ứng dụng desktop được viết bằng React và Electron.

Lúc bấy giờ, mục tiêu của mình không phải là thay thế React, mà chỉ đơn thuần là tái cơ cấu và áp dụng các giải pháp giúp hoàn thiện trải nghiệm và cải thiện tốc độ của lập trình viên (developer experience), tiêu biểu là Hot Module Replacement vì trước đó, mỗi khi đổi code thì phải chờ thật lâu để cả ứng dụng được build lại. Và rồi tìm thứ này lại ra thứ khác, mình quyết đinh thử [Snowpack](https://www.snowpack.dev/tutorials/svelte)*. Snowpack là một công cụ thay thế webpack, tận dụng ES module để tải code trực tiếp qua dev server mà không cần đóng gói (bundle) như trước. Bạn có thể tham khảo thêm [tài liệu của Snowpack](https://www.snowpack.dev/concepts/how-snowpack-works) để hiểu thêm cách hoạt động. Nói ngắn gọn nó có ý tưởng rất đột phá, và rất, rất nhanh. Cùng lúc đấy, cộng đồng Svelte cũng quan tâm đến ý tưởng tương tự, mối liên kết của Svelte và Snowpack khá chặt chẽ (hãy đọc qua [issue cũ rích này](https://github.com/sveltejs/sapper/issues/1204) nếu muốn biết thêm). [Rich Harris](https://github.com/Rich-Harris), tác giả của Svelte, cũng đã nhiều lần khen ngợi Snowpack. Thế là mình quyết định thử xem Svelte có gì hay, rồi dần dần đã chìm sâu vào hệ sinh thái này lúc nào không hay.

Trở lại năm 2022, đây là một năm quan trọng với Svelte. Trước đó Rich Harris đã rời công việc để [tham gia Vercel](https://vercel.com/blog/vercel-welcomes-rich-harris-creator-of-svelte), theo sau là [Simon](https://github.com/dummdidumm). Hai người này cùng rất nhiều thành viên khác trong core team Svelte đã thúc đẩy phát triển [Svelte Kit](https://svelte.dev/blog/sveltekit-beta), một metaframework vượt trội (so sánh như Next cho React hay Nuxt cho Vue vậy). Cộng đồng Svelte theo đà đã phát triển rộng và sâu hơn một cách nhanh chóng ([Svelte Discord](https://svelte.dev/chat), [Svelte Society](https://sveltesociety.dev/), [Svelte Radio](https://www.svelteradio.com/), [Svelte Summit](https://www.sveltesummit.com/), [Svelte Sirens](https://sveltesirens.dev/), và nhiều cộng đồng nhỏ trên nhiều quốc gia). Tháng 12, [Svelte Kit 1.0 chính thức ra mắt](https://svelte.dev/blog/announcing-sveltekit-1.0). Vậy là mình không còn lý do gì để nghi ngờ sự phát triển của Svelte. Mình đoán rằng lập trình viên cũng như doanh nghiệp lớn nhỏ dần sẽ tìm đến Svelte giống như một giải pháp thực tế, nghiêm túc như React hay Vue vậy. Lúc này, Svelte tại Việt Nam vẫn còn rất cục bộ, thiếu liên kết, thông tin, và một cộng đồng. Đó chính là lý do Svelte Việt Nam ra đời.

::: div c-text-cap2
\* Snowpack đã dừng phát triển. Thay vào đó là [Vite](https://vitejs.dev/) đến từ cộng đồng Vue. Ngày nay, hai cộng đồng Vite và Svelte cũng có nhiều liên kết chặt chẽ tương tự.
:::

## Mã nguồn mở

Svelte Việt Nam là một dự án mã nguồn mở (open source). Nói đúng hơn là một tập hợp các dự án mã nguồn mở được quản lý và đóng góp từ cộng đồng qua [Svelte Việt Nam Github Organization](https://github.com/sveltevietnam). Hiện tại, tất cả mã nguồn của Svelte Việt Nam, bao gồm cả trang bạn đang đọc, là công khai. Bất kì ai đều có thể truy cập và tham gia đóng góp.

Vậy vì sao là open source? Vì sao không? Nghĩ xem nào, có lẽ hơn 90% (một con số mình nghĩ ra và không có bằng chứng gì cả) công việc hằng ngày của một lập trình viên, đặc biệt là trên nền tảng web, là nhờ vào open source. Chúng ta luôn tiện tay cài ngay mười cái thư viện khi vừa khởi tạo một dự án bất kì, và mỗi cái đấy lại đi tải thêm mười cái thư viện con nữa, … rồi cả ứng dụng của chúng ta khi đưa lên production thì các đoạn code do ta viết chắc chắn là ít hơn so với của người khác. Open source có nghĩa là ta không nghĩ code của ta có gì đặc biệt hơn của người khác. Học từ open source, và đóng góp vào open source là một cách để ta giỏi hơn.

Svelte Việt Nam là open source và luôn khuyến khích các bạn tham gia vào cộng đồng open source. Nếu may mắn, Svelte Việt Nam có thể là điểm đầu tiên cho các bạn trẻ Việt Nam tiếp xúc với open source.

## Một cộng đồng

Svelte Việt Nam là một cộng đồng cho bất cứ ai quan tâm đến Svelte và open source. Chúng ta có [Discord](https://discord.sveltevietnam.dev/) chính thức là kênh chính để làm quen và thảo luận với nhau. Bên cạnh đó, [Blog của Svelte Việt Nam](/blog) là nơi để thành viên có thể chia sẻ dưới dạng bài viết. Trong tương lai, Svelte Việt Nam sẽ hướng đến tổ chức các buổi họp mặt trực tuyến hay trực tiếp, với hình thức có thể học hỏi từ Svelte Summit và các cộng đồng khác. Hy vọng rằng, thông qua các kênh thông tin và liên lạc trên, thành viên sẽ có cơ hội gặp gỡ, gắn kết, chia sẻ trải nghiệm và kiến thức.

### Phi cạnh tranh. Đồng phát triển

Svelte Việt Nam không có ý định cạnh tranh với các cộng đồng khác tại Việt Nam như Vue, React, … Nếu bạn tham gia Discord, có thể bạn cũng đã thấy lời nhắn của mình rằng hãy thoải mái trao đổi nhưng tránh so sánh hay chê bai các công nghệ khác. Sự thật là, chúng ta không thể tránh so sánh được. So sánh giúp ta nhìn nhận sự khác biệt và tương đồng, nhưng đôi khi ta bị cuốn vào cái khác mà quên đi rằng có rất nhiều cái giống. Vừa rồi, [Vite Conference](https://viteconf.org/23/) diễn ra với sự góp mặt của các thành viên từ rất nhiều cộng đồng khác nhau, không ai nói rằng “vì Vite xuất phát từ Vue nên tôi sẽ không dùng nó đâu”. Một ví dụ khác với công bố trong tháng vừa qua từ team Svelte về [Rune](https://svelte.dev/blog/runes), chúng ta học được rằng Svelte đã lấy ý tưởng từ tất cả các framework nổi tiếng, và hầu hết các framework front-end ngày nay đều bằng cách này hay cách nọ đi theo hướng Signal, là cái mà [Knockout](https://knockoutjs.com/) đã thực hiện cách đây rất nhiều năm. Khi một framework thành công thì tất cả cùng thành công, chứ không phải cứ phải có người thắng và kẻ thua. Như vậy, chúng ta giống nhau nhiều hơn ta tưởng.

Svelte Việt Nam luôn chào đón các bạn từ cộng đồng khác, và khuyến khích thành viên tham gia những diễn đàn bên ngoài và phản hồi cho ban quản trị khi thấy có bất cập hoặc những điểm hay có thể học hỏi được.

Xây dựng một cộng đồng không hề dễ. Bạn có thể tự hỏi rằng tại sao lại phải sinh ra một cộng đồng như vầy nữa trong khi có thể hòa chung vào các cộng đồng lớn. Câu trả lời là vì ta cần có điểm chung để dễ kết nối. Nếu hai bạn trong cùng một team còn xung đột, một chị backend còn cãi nhau với một anh frontend, thì cho một bạn Svelte gặp một bạn C++ chắc sẽ không nói với nhau được câu gì (đương nhiên là ta ko nên chỉ là dev thuần C++ hay Svelte, mình chỉ đang đơn giản hóa ví dụ thôi). Svelte Việt Nam mượn Svelte làm điểm chung để kết nối thành viên, và từ đó hướng họ đến với nền tảng web, với phần mềm, với open source, và nhiều thứ khác nữa.

## Một thí nghiệm xã hội

Sắp tới, mình sẽ gởi yêu cầu thành lập một [Open Collective](https://opencollective.com/)* riêng cho Svelte Việt Nam. Đây là phương án hiện tại cho vấn đề kinh phí của cộng đồng. Mình tin là có tiền thì mới làm nên việc. Tài chính sẽ giúp ta tổ chức sự kiện, chi trả cho các khoản phí về hạ tầng để đảm bảo chất lượng và giúp dự án phát triển hơn nữa. Nếu thật sự may mắn, ta có thể kéo các doanh nghiệp Việt Nam vào cuộc, vì tài trợ cho cộng đồng chính là đầu tư cho sự phát triển chung của cả ngành. Ta thậm chí còn có thể trích khoản tiền trong quỹ để tài trợ cho các cá nhân và nhóm có đóng góp lớn trong cộng đồng open source tại nước nhà (bất kể ở công nghệ, lĩnh vực nào).

Bạn sẽ thấy (hoặc đã thấy) rằng Svelte Việt Nam có những điểm khác biệt so với các cộng đồng khác ở Việt Nam, cả về mặt tổ chức lẫn chi tiết kỹ thuật. Tuy vậy, mô hình này không phải là mới. Vừa đây Github đã [mở rộng chương trình Sponsor của họ](https://github.blog/2023-10-03-sponsors-is-expanding/) đến 35 vùng mới trên thế giới, bao gồm cả Việt Nam. Các buổi gặp mặt, diễn đàn của Svelte, Vue, React, … cũng nhờ từ tiền tài trợ. Ngày càng có nhiều nền tảng (một ví dụ lớn là Patreon) tập trung đầu tư vào sức sáng tạo nhỏ lẻ, cá nhân, và các cộng đồng cục bộ. Lập trình cũng có thể là một công việc sáng tạo, chúng ta không khác nhiều với một youtuber, tiktoker là bao.

Tuy nhiên, cộng đồng Việt Nam có sẵn sàng cho những thứ trên hay không? Đa số đồng nghiệp mà mình gặp được trong công việc đều không quan tâm lắm về những vấn đề này. Cũng không thể trách được vì họ có gia đình và cuộc sống. Nhưng cũng có thể rằng, họ thiếu một tiền lệ, một động lực thúc đẩy.

Vì vậy, Svelte Việt Nam là một thí nghiệm xã hội của mình. Mình muốn thử xem tất cả những thứ mình suy nghĩ ở trên có đúng và đủ không. Có lẽ hai năm sau mình sẽ viết phần hai của bài này, chắc chắn rằng sẽ có nhiều thứ không còn đúng nữa, nhưng hy vọng rằng những điều mình đang làm vẫn có ý nghĩa.

::: div c-text-cap2
\* Open Collective là nền tảng nhận tài trợ với tính minh bạch cao, tất cả khoản thu, chi đều công khai. Đó là một trong những lý do mình chọn giải pháp này.
:::

## Một dấu chấm hỏi

Từ nãy giờ, mình đã trả lời câu hỏi “Svelte Việt Nam là gì” bằng góc nhìn hết sức chủ quan. Trong giai đoạn sơ khởi này, mình muốn Svelte Việt Nam là tất cả những thứ trên. Tuy nhiên, Svelte Việt Nam sẽ thay đổi theo cộng đồng của nó. Bây giờ nó là hình vẽ, câu chữ trong cuốn sổ tay của mình. Chính cộng đồng mới là thứ sẽ xây dựng một Svelte Việt Nam có hình thù và màu sắc cụ thể. Màu sắc và hình thù đó là gì không ai có thể biết được. Nó là một dấu chấm hỏi mà mình sẽ luôn dõi theo mỗi ngày.

## Tổng kết

Tóm lại, Svelte là một dự án open source, một cộng đồng mở, một thí nghiệm xã hội, và sẽ trở thành một thứ gì đó được nhào nặn từ chính cộng đồng. Mình hy vọng rằng Svelte Việt Nam sẽ là một khu vườn nhà mà trong đó các cây lúa, bông hoa sẽ lớn lên và bay đi khắp mọi nơi.
