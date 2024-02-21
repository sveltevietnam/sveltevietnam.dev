import { vi as common } from '../../../translation/vi';

export const vi = {
	...common,
	hostedBy: 'Đồng tổ chức bởi',
	timeline: {
		...common.timeline,
		introduction: 'Giới thiệu và làm quen',
		closing: 'Lời kết',
	},
	ticket: {
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
			'Video hoặc phiên thuyết trình của bạn nên có độ dài không quá 20 phút và có nội dung liên quan đến dự án, sản phẩm, kinh nghiệm, hay trải nghiệm về cộng đồng hoặc các công nghệ xoay quanh hệ sinh thái Svelte. Bạn có thể lấy ví dụ từ <a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">các bài chia sẻ trước từ Svelte Summit</a>.',
	},
};
