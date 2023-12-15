import { vi as common } from '../../../translation/vi';

export const vi = {
	...common,
	description:
		'Đây là sự kiện đầu tiên của cộng đồng Svelte Việt Nam và cuối cùng của năm 2023, \
		khi chúng ta đang dần đi hết thêm một năm đầy biến động, nhiều thay đổi API và tràn ngập tin tức về AI. \
		Sự kiện lần này dự kiến sẽ kéo dài khoảng hai giờ, kết hợp giữa \
		video quay trước và thảo luận trực tiếp. Chúng ta học hỏi từ các sự kiện từ \
		<a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">Svelte Summit</a>, \
		<a class="c-link" href="https://viteconf.org/" rel="noreferrer" target="_blank">Vite Conf</a>, \
		và các sự kiện khác trong hệ sinh thái web. Hy vọng rằng, đây sẽ là tiền lệ cho nhiều sự kiện về sau! \
		',
	links: {
		watch: 'Xem livestream (ẩn danh, cầm bắp rang ngồi xem!)',
		join: 'Tham gia trực tiếp (cười lên nào, sẽ lên sóng đó!) - sẽ thông báo sau',
		discuss: 'Thảo luận cùng cộng đồng tại Discord',
	},
	timeline: {
		...common.timeline,
		introduction: 'Giới thiệu và làm quen',
		discussion: 'Thảo luận',
		discussion1: 'Phản hồi từ cộng đồng',
		discussion2: 'Thảo luận tự do',
		video: 'Video stream',
		video1: {
			title: 'Một Svelte Việt Nam',
			about:
				'Thống kê, thông tin chung về thực trạng dự án Svelte Việt Nam, và vài lời từ ban quản trị',
		},
		video2: 'Vài bí mật về sveltevietnam.dev',
		closing: 'Lời kết',
	},
	proposal: {
		...common.proposal,
		guidelines:
			'Video hoặc phiên thuyết trình của bạn nên có độ dài không quá 15 phút và có nội dung liên quan đến dự án, sản phẩm, kinh nghiệm, hay trải nghiệm về cộng đồng hoặc các công nghệ xoay quanh hệ sinh thái Svelte.',
	},
	images: {
		...common.images,
		cover: 'Ảnh bìa sự kiện',
	},
};
