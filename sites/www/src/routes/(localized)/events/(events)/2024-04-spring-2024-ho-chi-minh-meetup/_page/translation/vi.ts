import { vi as common } from '../../../translation/vi';

export const vi = {
	...common,
	hostedBy: 'Đồng tổ chức bởi',
	becomeSpeaker: 'Trở thành diễn giả và chia sẻ trải nghiệm của bạn với cộng đồng',
	timeline: {
		...common.timeline,
		introduction: 'Giới thiệu và làm quen',
		share: 'Phiên chia sẻ',
		share1: {
			time: '15p trình bày, 10p trả lời câu hỏi',
			title: 'Svelte, Javascript, và nền tảng Web',
			description:
				'\
				Phải chăng bạn là một lập trình viên Svelte, lập trình viên Javascript, \
				lập trình viên frontend, hay lập trình viên web? \
				Svelte có vị trí như thế nào trong hệ sinh thái web hôm nay? Bạn có nên quan tâm? \
				Cùng xem sao nhé! \
			',
		},
		share2: {
			time: '15p trình bày, 10p trả lời câu hỏi',
			title: 'Web designer và Svelte, hành trình tìm sự sáng tạo và tự do',
			description:
				"\
				Hành trình từ UI/UX đến Svelte: Đây không chỉ là một con đường khơi dậy sáng tạo \
				và khả năng 'code lách' một cách nghệ thuật mà còn là cơ hội để mở rộng khả năng \
				thiết kế, có thể thực sự làm chủ và thể hiện ý tưởng một cách tự do nhất.\
			",
		},
		qa1: {
			title: 'Svelte và hệ sinh thái của Svelte',
			description:
				'\
				Svelte chưa được phổ biến rộng tại Việt Nam so với các công nghệ khác, \
				vì vậy chắc hẳn bạn có rất nhiều cầu hỏi cần được giải đáp. \
				Trong phiên thảo luận này, hãy nêu lên những thắc mắc và ý kiến của bạn nhé!\
			',
		},
		discussion1: {
			title: 'Thảo luận: "Mã nguồn mở - thử thách và cơ hội"',
			description:
				'\
				Bạn đã từng đóng góp vào thư viện, mã nguồn, hoặc issue tại Github, hay tham gia hỏi / trả lời câu \
				hỏi trên các diễn đàn như Discord, Reddit, Stack Overflow chưa? Nếu có, bạn đã là một thành viên \
				của cộng đồng mã nguồn mở. Cùng lắng nghe trải nghiệm và chia sẻ của các thành viên về mã nguồn mở trong \
				phiên thảo luận này.\
			',
		},
		qa: 'Hỏi đáp',
		openDiscussion: 'Thảo luận tự do',
		closing: 'Lời kết',
	},
	ticket: {
		description:
			'\
			Svelte Việt Nam rất vui được đồng hành cùng <a class="c-link" href="https://www.designveloper.com" target="_blank" rel="noreferrer">Designveloper</a>\
			trong sự kiện Gặp mặt Xuân Giáp Thìn lần này tại thành phố Hồ Chí Minh. Đây là sự kiện gặp mặt trực tiếp đầu tiên của cộng đồng Svelte Việt Nam.\
			Ban tổ chức hoan nghênh tất cả mọi người bất kể chuyên môn và trình độ đến với sự kiện để kết nối và chia sẻ trải nghiệm của bạn.\
		',
		title: 'Đăng ký vé điện tử miễn phí',
		form: {
			name: 'Tên',
			cta: 'Đăng ký',
			checkbox: 'Tôi đồng ý nhận thông báo cho các sự kiện sắp tới.',
		},
	},
	faq: {
		title: 'Câu hỏi thường gặp',
		entries: {
			whyTicket: {
				q: 'Tại sao tôi cần phải đăng ký vé điện tử? Có cần trả phí hay không?',
				a: 'Sự kiện là hoàn toàn miễn phí. Tuy nhiên vì số lượng ghế ngồi có giới hạn, bạn nên đăng ký để giúp cho ban tổ chức chuẩn bị một cách tốt nhất.',
			},
			noTicket: {
				q: 'Tôi có thể đến nếu không đăng ký vé?',
				a: '\
					Ban tổ chức khuyến khích bạn nên đăng ký vé điện tử. \
					Tuy nhiên bạn vẫn có thể đến tham dự mà không cần đăng ký trước và \
					sẽ được hỗ trợ tại cửa sự kiện. \
				',
			},
			whenAndWhere: {
				q: 'Sự kiện diễn ra khi nào và ở đâu?',
				a: '\
					Sự kiện sẽ diễn ra vào ngày 20 tháng 4, năm 2024, lúc 9 giờ sáng giờ Việt Nam, tại văn phòng công ty \
					<a class="c-link" href="https://www.designveloper.com" target="_blank" rel="noreferrer">Designveloper</a>, địa chỉ \
					<a class="c-link" href="https://maps.app.goo.gl/ymGh3Djmwjnb7ohu5" target="_blank" rel="noreferrer">tầng 6, 55 Phó Đức Chính, Quận 1, TP. Hồ Chí Minh</a>. \
					Tòa nhà có bãi đỗ xe. Hướng dẫn sẽ được cung cấp thêm khi bạn đến nơi.<br>\
					Bạn còn có thể tìm thấy thông tìn vừa rồi ở đầu trang này hoặc trong email sau khi đăng ký vé điện tử. \
				',
			},
			requirement: {
				q: 'Tôi cần mang theo gì khi đến sự kiện',
				a: '\
					Bạn chỉ cần chuẩn bị mã QR để check-in tại cửa sự kiện. Mã QR được gởi kèm email sau khi bạn đăng ký vé điện tử \
					(nếu bạn không tìm thấy email, hãy kiểm tra hộp thư spam nhé).\
				',
			},
			help: {
				q: 'Tôi có thể tìm hỗ trợ ở đâu? Nếu tôi muốn giúp cho sự kiện thì nên làm gì?',
				a: '\
					Bạn hãy tham gia <a class="c-link" href="https://discord.sveltevietnam.dev" target="_blank" rel="noreferrer">Discord chính thức</a>. \
					Tại đó bạn có thể thảo luận và tìm trợ giúp từ quản trị viên hoặc các thành viên trong cộng đồng.<br>\
					Tương tự, ban tổ chức có thể nhờ đến sự giúp đỡ của bạn trong quá trình chuẩn bị và chạy sự kiện. Nếu bạn hứng thú hãy liên lạc qua Discord nhé. \
					Cảm ơn bạn!\
				',
			},
		},
	},
	proposal: {
		...common.proposal,
		guidelines:
			'\
			Video hoặc phiên thuyết trình của bạn nên có độ dài không quá 20 phút \
			và có nội dung liên quan đến dự án, sản phẩm, kinh nghiệm, hay trải nghiệm về \
			cộng đồng hoặc các công nghệ xoay quanh hệ sinh thái Svelte. \
			Bạn có thể lấy ví dụ từ <a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">các bài chia sẻ trước từ Svelte Summit</a>.\
			',
	},
	imageCredit: 'Hình ảnh nền từ Unsplash bởi',
	musicCredit: 'Âm nhạc sử dụng trong sự kiện được sáng tác và cấp quyền sử dụng bởi',
};
