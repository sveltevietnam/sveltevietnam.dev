<script>
	import BaseNotification from '$client/notifications/BaseNotification.svelte';
	import DiscordNotification from '$client/notifications/DiscordNotification.svelte';
	import notificationHoverImage from './images/notification-hover-vi.gif';
	import fallbackAvatar from '$shared/assets/images/fallback/default.jpg?w=60&imagetools';
	import devToolsSlow3gImage from './images/devtools-slow-3g.jpg?format=webp&imagetools';
	import disableJavascriptImage from './images/disable-javascript.png?format=webp&imagetools';
	import notFoundPageImage from './images/not-found-page.png?format=webp&imagetools';
	import blueScreenOfDeathImage from './images/blue-screen-of-death.png?format=webp&imagetools';
	import asciiPhoImage from './images/ascii-pho.jpg?format=webp&imagetools';
</script>

:::div c-callout c-callout--info
Bài viết này bổ trợ cho [video cùng tên](TBA) tên được chiếu tại sự kiện "[Gặp nhau trực tuyến cuối năm 2023](/events/202312-year-end-online-meetup)". Đây cũng là phần thứ ba trong chuỗi bài viết có tên “Behind the Screen”, nơi mình chia sẻ những kinh nghiệm và bài học trong quá trình xây dựng *sveltevietnam.dev*. Bạn có thể tìm đọc bài viết trước "[Giao diện tối (dark mode) với SvelteKit, PostCSS, và TailwindCSS](/blog/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss)".
:::

## Thông báo đẩy

Có thể bạn đã từng bắt gặp thông báo hệ thống khi ghé thăm trang *sveltevietnam.dev*, trông như thế này:

:::div not-prose
<BaseNotification intent="info">
	<p>Một thông báo từ hệ thống, xuất hiện và tự động ẩn đi sau một khoảng thời gian tại góc phải, trên của trang</p>
</BaseNotification>
:::

Cũng không có gì đáng ngạc nhiên: thông báo đẩy (tiếng anh hay gọi là toast hay push notification) là một thành phần thường gặp trong các ứng dụng web. Thông báo hệ thống của *sveltevietnam.dev* có bốn biến thể tương ứng với bốn trạng thái hay mục đích thông dụng: thông tin, thành công, cảnh báo, và thất bại hay lỗi. Bạn có thể tham khảo thêm ví dụ cho từng biến thể tại trang [Thiết kế | Màu sắc](/design/colors#status).

Theo mặc định, mỗi thông báo có một đồng hồ hẹn giờ bên trong: thông báo sẽ tự động biến mất khi hết giờ hẹn trong vài giây. Tuy nhiên, khi bạn rê chuột vào thông báo (hay chạm và giữ tay trên các thiết bị chạm), đồng hồ sẽ tạm dừng để bạn có thời gian đọc hoặc tương tác, ví dụ như sao chép nội dung hoặc lựa chọn hành động phù hợp. Bạn có thể thử nghiệm bằng cách nhấn vào nút sao chép đường dẫn trong phần "[Chia sẻ](#share)" của bài viết này.

<img src={notificationHoverImage} alt="nhấn nút sao chép đường dẫn, thông báo hiển thị, khi rê chuột vào thì đồng hồ tạm dừng" width="2155" height="1343" class="max-w-full border" />

Hệ thống thông báo được thiết lập nhờ vào thư viện [@svelte-put/noti](https://svelte-put.vnphanquang.com/docs/noti) (do mình viết ra). Bạn có thể tham khảo qua nếu có nhu cầu sử dụng. Bây giờ, ta cùng đi qua một số thông báo cụ thể và thú vị được sử dụng tại *sveltevietnam.dev*.

### Thông báo phiên bản mới

Khi có một phiên bản mới được triển khai thành công đến máy chủ, trang web sẽ hiển thị thông báo như sau:

:::div not-prose
<BaseNotification intent="info">
	<p>Trang web đang được cập nhật với phiên bản mới. Tải lại trang để có trải nghiệm tốt nhất bạn nhé!</p>
</BaseNotification>
:::

Ta luôn muốn người dùng truy cập vào phiên bản mới nhất. Điều này khá phổ biến hay thậm chí là bắt buộc đối với các ứng dụng di động, nhưng ít gặp hơn với ứng dụng web. Trang web có thể được cache bằng nhiều phương thức; ta cũng không thể cố bắt người dùng tải lại trang (ví dụ đối với người dùng không thể truy cập Javascript). Dù có thể đi nữa, ta cũng không nên làm như vậy: hãy tưởng tượng bạn đang đọc bài viết này và trang web tự động tải lại trang - khá là khó chịu nhỉ. Nói tóm lại, tại một thời điểm, một trang web có thể tồn tại ở nhiều phiên bản trên nhiều thiết bị khác nhau, và *sveltevietnam.dev* lựa chọn thông báo cho người dùng điều này và để họ chủ động tải lại trang khi có thể.

### Thông báo tin nhắn từ Discord

Nếu bạn ở trên trang web đủ lâu, bạn sẽ bắt gặp thông báo trông như sau:

:::div not-prose
<DiscordNotification name="Nguyễn Văn A" avatarURL={fallbackAvatar} />
:::

Thông báo này xảy ra khi có ai đó vừa nhắn tin tại Discord. Nó không mang lại cải thiện trực tiếp gì, nhưng giúp tạo nên một không gian động, có gì đó đang diễn ra chứ không phải người dùng đang có một trải nghiệm hoàn toàn đơn độc. Ngoài ra, thông báo cũng khuyến khích người dùng tham gia vào Discord - kênh giao tiếp chính của cộng đồng Svelte Việt Nam.

### Thông báo tín hiệu đường truyền gián đoạn

Khi bạn mở trang web trên các thiết bị hoặc với môi trường giới hạn về đường truyền như 3G, hoặc nơi phủ sóng kém, bạn có thể gặp phải thông báo sau:

:::div not-prose
<BaseNotification intent="info">
	<p>Phát hiện gián đoạn do kết nối không ổn định. Xin lỗi bạn vì sự bất tiện này!</p>
</BaseNotification>
:::

Để giả lập tình huống này, bạn có thể chọn "Slow 3G" trong tùy chỉnh tại cửa sổ "Network" của devtool.

<img src={devToolsSlow3gImage} alt="chụp màn hình tại cửa sổ Network, tùy chỉnh slow 3G" width="400" height="432" class="mx-auto max-w-full h-auto" />

Vậy làm sao để phát hiện được đường truyền đang chậm? *sveltevietnam.dev* sử dụng một thủ thuật dựa vào độ chênh lệch của hai mốc thời gian: `SplashScreen` và "[hydration](https://en.wikipedia.org/wiki/Hydration_(web_development))". Hydration là một phương pháp phổ biến trong các framework front-end ngày nay, nó sử dụng Javascript để biến một trang web tĩnh thành động, cung cấp môi trường phù hợp với framework để thực hiện các kỹ thuật giúp cập nhật DOM theo tương tác của người dùng và biến đổi của hệ thống. Còn `SplashScreen` là màn hình chờ với hiệu ứng chuyển động tương đối đơn giản và nhanh chóng, hiển thị đầu tiên ngay khi người dùng vừa truy cập vào ứng dụng. Ngoài việc mang lại hình ảnh thú vị thu hút người dùng, `SplashScreen` là giải pháp tốt để đánh lạc hướng một cách nhẹ nhàng trong khi hệ thống đang tải tài nguyên cần thiết và thiết lập môi trường hoàn chỉnh.

Hai mốc thời gian này là thiết yếu đối với chúng ta. Sau khi `SplashScreen` hoàn thành, người dùng kỳ vọng có thể sử dụng trang web được ngay. Khi tốc độ mạng nhanh, điều này diễn ra đúng như mong đợi: trong khi `SplashScreen` đang hoạt động, tài nguyên đã được tải, và hydration đã hoàn thành. Nhưng khi mạng chậm, việc tải tài nguyên sẽ bị trì hoãn, kéo theo hydration bị trễ. Vì vậy, nếu hydration diễn ra một vài giây sau `SplashScreen`, ta ghi nhận rằng đường truyền đang không ổn định. Lúc này sẽ xảy ra hiện tượng chớp nháy ở một sổ thành phần, cho nên việc tối thiểu ta nên làm là thông báo cho người dùng kèm theo lời xin lỗi lịch sự (dù thực ra nó không hoàn toàn là lỗi của ứng dụng).

`SplashScreen` là một chủ đề thú vị và dài dòng. Ta sẽ bàn thêm trong một bài viết sau!

## Không Javascript? Không lo

Nếu mình bảo rằng bạn có thể sử dụng hơn 90% trang *sveltevietnam.dev* mà không cần Javascript (JS), có lẽ bạn sẽ bảo rằng: thật ngớ ngẩn, tại sao có JS lại không dùng? Sự thật là, một số người dùng không thể tiếp cận JS vì lý do bảo mật; một số người dùng khác chủ động tắt JS đi để bảo vệ quyền riêng tư và cải thiện tốc độ (như mình đây, và bạn cũng nên thử). Mình có thể nghe bạn nói là: những người dùng này chiếm phần trăm nhỏ so với tổng số. Đúng là như vậy, tuy nhiên việc quan trọng hơn ta cần ghi nhận là bất cứ người dùng nào cũng có khả năng không truy cập được JS. Mình khuyên bạn nên xem qua [sơ đồ này](https://www.kryogenix.org/code/browser/everyonehasjs.html), nó sẽ dẫn đến nhiều tài liệu khác để thuyết phục bạn về luận điểm vừa rồi. Nói tóm lại, hỗ trợ cho tình huống này đồng nghĩa với việc ta đề cao trải nghiệm người dùng mà không phân biệt hoàn cảnh của họ.

Hiện thực hóa điều này không dễ, đặc biệt là nếu bạn đã quen với việc lệ thuộc vào Javscript hay phát triển ứng dụng đơn trang (Single Page App, SPA). May mắn là, Svelte và SvelteKit cung cấp rất nhiều công cụ cho nhiệm vụ này. Nền tảng web và các API tiêu chuẩn cũng dần đang được cải thiện để giảm đi sự phụ thuộc vào JS. Tổng hợp các kỹ thuật này gọi chung là "cải thiện tăng dần" (tạm dịch từ "progressive enhancement").

Khi tắt JS tại trang *sveltevietnam.dev*:

- nội dung chính vẫn hiển thị đầy đủ, vì trang đã được biểu hiện trước từ phía máy chủ (server-side rendering, SSR) nhờ SvelteKit,
- `SplashScreen` vẫn hoạt động, vì các hoạt ảnh được viết hoàn toàn bằng CSS,
- điều hướng vẫn hoạt động, bao gồm việc ghi nhớ và chuyển đổi ngôn ngữ, vì cốt yếu các thao tác này là thẻ `a` cộng với hỗ trợ từ phía máy chủ,
- chuyển đổi giữa chế độ hiển thị sáng và tối vẫn hoạt động, vì thành phần này có hỗ trợ dự bị khả năng giao tiếp và điều hướng từ máy chủ bằng biểu mẫu HTML và query param. Hiệu ứng đóng, mở của menu sổ xuống cũng vẫn hoạt động vì nó không dùng JS (có thể bạn thấy ngạc nhiên nhưng một mẹo CSS mà cái menu này thật sự ko cần JS!),
- menu tại header vẫn hoạt động (trên thiết bị có chiều ngang nhỏ như di động); tương tự như trên, thành phần này được viết bằng HTML và CSS thuần túy.

Bạn có thể tắt JS bằng cách mở devtool, ấn tổ hợp phím "Ctrl + Shift + P", nhập "Disable Javascript" và nhấn enter. Để bật lại, thực hiện các bước tương tự nhưng thay câu lệnh thành "Enable Javascript".

<img src={disableJavascriptImage} class="max-w-full" width="1582" height="619" alt="chụp màn hình tại devtool với command palette đã mở và lệnh Disable Javascript đã được gõ" />

Mình đã dành khá nhiều thời gian để thử nghiệm và kiểm tra các tính năng trên, đặc biệt là những thành phần có hiệu ứng và hoạt ảnh, để tương thích và chuyển đổi một cách trơn tru từ lúc chưa có JS đến khi hydration đã thực hiện xong. Đương nhiên, đạt được 100% là không thực tế, và không thể phủ nhận rằng JS là cần thiết cho việc nâng cao trải nghiệm người dùng. Hiện nay, các tính năng đáng tiếc chỉ hoạt động khi có JS là:

- một số hiệu ứng và hoạt ảnh, như tiêu đề các phần hay hoạt ảnh ở đầu trang,
- tooltip,
- thông báo đẩy,
- phần "mục lục" tại các bài viết,
- biểu mẫu đăng kí nhận tin tại trang [Sự kiện](/events), [Việc làm](/jobs), và các trang [Blog](/blog) - phần này phụ thuộc vào [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) và chỉ làm được khi có JS.

Các phần trên đây khá là khô khan và nặng về kỹ thuật đúng không nào? Hãy cũng thay đổi không khí và khám phá những thứ vui vẻ hơn nhé!

## Phở ASCII

Nhân tiện nhắc đến devtool, nếu mở cửa sổ "Console", bạn sẽ thấy cái này:

<img src={asciiPhoImage} class="mx-auto max-w-full" width="512" height="486" alt="một tô (bát) phở được vẽ bằng kí tự ascii" />

Nếu bạn thắc mắc tại sao, thì câu trả lời là vì mình thấy nó vui, đơn giản vậy thôi. Hết rồi.

## Minh họa lộ trình

Khi ghé thăm trang [Lộ trình](/roadmap), bạn sẽ thấy một số hình ảnh chìm dưới nền. Đầu tiên là:

<svg inline-src="../../../../roadmap/_page/images/au-lac.svg" class="w-full h-auto opacity-20" />

Chắc bạn đã nhận ra rằng đây chính là con [chim Lạc](https://vi.wikipedia.org/wiki/Chim_L%E1%BA%A1c) nổi tiếng trong truyền thuyết Việt Nam từ thời kì Văn Lang, Âu Lạc - phù hợp với tên của cột mốc "Âu Lạc" là giai đoạn sơ khởi của dự án Svelte Việt Nam, với nhiều kế hoạch và ý tưởng đang chờ được thực hiện.

---

Tiếp đến, tại cột mốc "Tự" sẽ là các văn tự cổ:

:::div flex w-full gap-4 tb:gap-10 opacity-20 my-6 tb:my-10
<svg inline-src="../../../../roadmap/_page/images/tu_chu.svg" class="h-auto" />
<svg inline-src="../../../../roadmap/_page/images/tu_nom.svg" class="h-auto" />
:::

Đây chính là từ "Chữ Nôm" viết bằng [chữ Nôm](https://vi.wikipedia.org/wiki/Ch%E1%BB%AF_N%C3%B4m). Trong giai đoạn này, dự án Svelte Việt Nam tập trung phát triển về *nội dung*: trang [Blog](/blog) để chia sẻ thông tin, trang [Sự kiện](/events) để chuẩn bị cho các sự kiện sắp tới, ... Bài viết bạn đang đọc cũng được soạn trong giai đoạn này.

---

Cuối cùng, ta thấy một đồng tiền ở cột mốc "Đồng":

<svg inline-src="../../../../roadmap/_page/images/dong.svg" class="w-full opacity-20 my-6 tb:my-10" />

Đây là đồng "Thiên Phúc trấn bảo" được đúc vào thời Tiền Lê và là một trong những đồng tiền đầu tiên của Việt Nam. Tại cột mốc này, mình - với vai trò ban quản trị Svelte Việt Nam - dự định tập trung phát triển trang [Việc làm](/jobs) với hy vọng tìm ra giải pháp tổng hợp công việc liên quan từ các kênh tuyển dụng phổ biến vào một nơi tập trung để ứng viên có thể tìm kiếm môt cách nhanh chóng. Ngoài ra, mình cũng muốn tạo ra một xu hướng đồng phát triển bền vững giữa doanh nghiệp và cộng đồng. Thay vì chi trả cho các nền tảng tuyển dụng, doanh nghiệp có thể [tài trợ](/sponsor) cho chúng ta để được đăng tuyển trực tiếp tại trang [Việc làm](/jobs). Số tiền tài trợ này sẽ được dùng để tổ chức các sự kiện cho cộng đồng. Doanh nghiệp đầu tư vào cộng đồng, cộng đồng củng cố và cung cấp nhân lực cho doanh nghiệp. Đây là một chu trình tương hỗ, giúp cả hai bên cùng phát triển.

:::div c-callout c-callout--info
Mô hình trên đã có ở các nước phát triển nhưng còn ít tại Việt Nam. Mình có nhắc đến điều này trong bài viết "[Svelte Việt Nam: từ vườn nhà vươn ra thế giới](/blog/20231012-svelte-vietnam-from-local-to-global)". Nếu có thể bạn hãy đọc qua để hiểu thêm về định hướng phát triển của Svelte Việt Nam nhé!
:::

## Màn hình xanh

Hiện tại, chúng ta chưa có thiết kế cụ thể cho [trang 404](https://www.sveltevietnam.dev/giberrish). Tuy nhiên, nếu gặp phải trang này, bạn sẽ thấy một lời nhắn khá thú vị:

<img src={notFoundPageImage} class="max-w-full border" width="1024" height="576" alt="trang 404 với lời nhắn thú vị" />

Nếu bạn đọc bài viết này trong tương lai, có thể giao diện trang 404 đã khác đi, nhưng hy vọng bạn sẽ thấy lời nhắn tương tự. Khi nhấn vào đường dẫn "Would you like a blue screen?", bạn sẽ được chào đón bằng một màn hình xanh nổi tiếng (chắc hẳn là không xa lạ với các bạn 8x, 9x):

<img src={blueScreenOfDeathImage} class="max-w-full border" width="1024" height="658" alt="phiên bản màn hình xanh của sveltevietnam.dev" />

## Bài tập cho bạn: Logo Svelte Việt Nam

Logo của Svelte Việt Nam gần như luôn hiển thị ở phần trên và góc trái của ứng dụng. Khi bạn đang không ở trang chủ, nhấn vào logo sẽ chuyển hướng bạn về lại trang chủ. Khi ở trang chủ, bạn sẽ có cảm giác như logo không thể nhấn vào được. Nhưng hãy thử nhấn vào logo đúng **mười hai lần** xem chuyện gì xảy ra nhé (gợi ý: tốt hơn nếu bạn dùng máy tính thay vì điện thoại)!

## Kết

Trên đây là một vài chi tiết rất nhỏ nhưng hy vọng qua đấy bạn có thể hiểu thêm về cách mà mình thiết kế và xây dựng trang *sveltevietnam.dev*. Phải vui! Đó là yếu tố rất quan trọng. Người dùng đầu tiên chính là người viết ra phần mềm; nếu ta thấy vui khi dùng chính sản phẩm của mình, có lẽ đó cũng là thành công rồi. Cho dù bạn có đang viết React hay Svelte, HTMX hay Astro, Golang hay Rust, chúc bạn sẽ luôn tìm thấy được niềm vui nho nhỏ đâu đấy nhé!
