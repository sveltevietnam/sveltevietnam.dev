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
    },
    notImplemented: 'Tính năng sắp hoàn thiện. Quay lại sau bạn nhé!',
    success: 'Đăng kí thành công. Cảm ơn bạn nhé!',
  },
};
