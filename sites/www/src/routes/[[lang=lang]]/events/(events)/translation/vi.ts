import { EMAILS } from '$shared/constants';

export const vi = {
	highlights: 'Điểm nhấn',
	time: 'Thời gian',
	location: 'Địa điểm',
	tba: 'Sẽ được thông báo sau',
	tentative: 'dự kiến',
	sponsors: {
		title: 'Nhà tài trợ',
		tba: {
			description: 'Trở nhành nhà tài trợ và giúp duy trì các sự kiện cộng động!',
			cta: 'Tìm hiểu thêm',
		},
	},
	timeline: {
		title: 'Chương trình',
	},
	images: {
		title: 'Hình ảnh',
		placeholder: 'Hình ảnh mẫu',
	},
	proposal: {
		title: 'Trở thành diễn giả',
		description:
			'Ban tổ chức sự kiện đang tiếp nhận đề xuất cho nội dung chương trình. Bạn có thể chia sẻ với cộng đồng thông qua video quay trước hoặc một phiên thuyết trình trực tiếp tại sự kiện. Rất mong được sự tham gia của bạn!',
		links: {
			discord: 'Liên hệ ban tổ chức thông qua Discord',
			email: `Gởi đề xuất đến ${EMAILS.EVENTS}`,
		},
		inPageLink: 'Đăng ký trở thành diễn giả!',
	},
};
