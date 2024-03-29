export const vi = {
	title: 'Check in sự kiện',
	upcoming:
		'\
		Háo hức đến với sự kiện? Ban tổ chức cũng vậy đó! Tuy nhiên còn hơi sớm bạn nhỉ?<br>\
		Bạn có thể tự check in từ <strong>hai giờ trước khi sự kiện bắt đầu</strong> cho đến <strong>hai giờ sau khi sự kiện kết thúc</strong>.<br>\
		Trong khi chờ đợi, hãy xem qua <a class="c-link" href="/vi/blog">trang Blog của Svelte Việt Nam</a> bạn nhé! \
	',
	past: '\
		Sự kiện đã kết thúc. Cảm ơn bạn đã quan tâm. Hãy \
		<a class="c-link" href="/vi/su-kien#mail">đăng ký theo dõi</a> các sự kiện sắp đến \
		để không bỏ lỡ bạn nhé!<br>\
		Hẹn gặp lại!\
	',
	timer: {
		countdown: 'Đếm ngược đến sự kiện',
		elapsed: 'Sự kiện đã diễn ra',
	},
	checkin: {
		or: 'hoặc',
		qr: {
			cta: 'Quét mã QR',
			modal: {
				title: 'Quét mã QR',
				description: 'Hệ thống có thể yêu cầu quyền truy cập camera của bạn.',
			},
		},
		form: 'Điền thông tin và nhấn nút để hoàn thành check-in.',
		success: {
			ok: 'Check in thành công. Chúc bạn một sự kiện tốt đẹp!',
			already: 'Bạn đã check in rồi. Xin cảm ơn!',
		},
		error: {
			missing: 'Vui lòng điền đầy đủ thông tin cần thiết trước khi check in. Cảm ơn bạn!',
			invalidQR:
				'Mã QR không hợp lệ. Bạn có thể tìm thấy mã QR trong email xác nhận đăng ký sự kiện.',
		},
	},
};
