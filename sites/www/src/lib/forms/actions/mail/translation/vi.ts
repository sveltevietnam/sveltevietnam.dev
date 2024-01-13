export const vi = {
	name: 'Tên',
	cta: 'Đăng kí',
	validation: {
		error: {
			email: {
				required: 'Email không được để trống',
				invalid: 'Email không hợp lệ',
			},
			name: {
				required: 'Tên không được để trống',
				invalid: 'Tên không hợp lệ',
			},
			captcha: {
				required: 'Cloudflare Turnstile response không được để trống',
				unknown: 'Lỗi không xác định từ Cloudflare Turnstile',
			},
			unknown: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!',
		},
		alreadyRegister: 'Bạn đã đăng kí rồi. Cảm ơn bạn!',
		success: 'Đăng kí thành công. Cảm ơn bạn!',
	},
};
