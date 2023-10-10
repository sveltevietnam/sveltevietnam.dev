import { SOCIAL_LINKS } from '$shared/constants';

export const vi = {
  urlCopyNotice: 'Đã sao chép đường dẫn bài viết',
  unsupportedLanguage: `Bài viết đang hiện thị với ngôn ngữ mặc định vì chưa được dịch sang ngôn ngữ bạn đã chọn. Nếu có thể, hay tham gia <a href="${SOCIAL_LINKS.github}" class="c-link" target="_blank" rel="noreferrer">Github</a> và <a href="${SOCIAL_LINKS.discord}" class="c-link" target="_blank" rel="noreferrer">Discord</a> để hỗ trợ dịch bài bạn nhé. Xin cảm ơn!`,
  readMinutes: 'phút đọc',
  tableOfContents: {
    title: 'Mục lục',
    linkLabelToTitle: 'Tiêu đề',
  },
  mailingListCall: 'Đăng kí nhận thông báo bài viết mới từ Blog của Svelte Việt Nam',
  editLink: {
    intro: 'Bạn tìm thấy lỗi chính ta hay cần đính chính nội dung?',
    label: 'Sửa đổi trang này tại Github',
  },
};
