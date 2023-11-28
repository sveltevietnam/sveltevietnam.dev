import { vi as common } from '../../../translation/vi';

export const vi = {
	...common,
	description:
		'Đây là sự kiện đầu tiên của cộng đồng Svelte Việt Nam và cuối cùng của năm 2023, \
		khi chúng ta đang dần khép lại thêm một năm đầy biến động, nhiều thay đổi API và tràn ngập tin tức về AI. \
		Sự kiện lần này dự kiến sẽ kéo dài khoảng hai giờ rưỡi, kết hợp giữa \
		video quay trước và thảo luận trực tiếp. Chúng ta học hỏi từ các sự kiện từ \
		<a class="c-link" href="https://www.sveltesummit.com/" rel="noreferrer" target="_blank">Svelte Summit</a>, \
		<a class="c-link" href="https://viteconf.org/" rel="noreferrer" target="_blank">Vite Conf</a>, \
		và các sự kiện khác trong hệ sinh thái web. Hy vọng rằng, đây sẽ là tiền lệ cho nhiều sự kiện về sau! \
		',
	timeline: {
		...common.timeline,
		introduction: 'Giới thiệu và làm quen',
		discussion1: 'Thảo luận: phản hồi từ cộng đồng',
		video1: {
			title: 'Video stream: "Một Svelte Việt Nam"',
			about: 'Thông tin chung về thực trạng dự án Svelte Việt Nam, và vài lời từ ban quản trị',
		},
		video2: 'Video stream: "Vài bí mật về sveltevietnam.dev"',
		closing: 'Lời kết',
	},
	images: {
		...common.images,
		cover: 'Ảnh bìa sự kiện',
	},
};
