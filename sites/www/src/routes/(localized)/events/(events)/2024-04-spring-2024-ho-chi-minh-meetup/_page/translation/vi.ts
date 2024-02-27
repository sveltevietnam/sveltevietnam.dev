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
			title: 'Svelte, Javascript, và Web',
			about:
				'\
				Phải chăng bạn là một lập trình viên Svelte, lập trình viên Javascript, lập trình viên frontend, hay lập trình viên web? \
				Svelte có vị trí như thế nào trong hệ sinh thái web hôm nay? Bạn có nên quan tâm? \
				Cùng xem sao nhé! \
			',
		},
		discussion: 'Thảo luận tự do',
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
		whyTicket: {
			q: 'Tại sao tôi cần phải đăng ký vé điện tử? Có cần trả phí hay không?',
			a: 'Sự kiện này là hoàn toàn miễn phí. Tuy nhiên vì số lượng ghế ngồi có giới hạn, bạn nên đăng ký để giữ chỗ và giúp cho ban tổ chức chuẩn bị một cách tốt nhất.',
		},
		howToGetThere: {
			q: 'Làm thế nào để tìm được địa điểm của sự kiện?',
			a: 'Hiện tại ban tổ chức đang tìm kiếm địa điểm thích hợp và sẽ thông báo khi có thông tin cụ thể.',
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
};
