import { SOCIAL_LINKS } from '$shared/constants';

export const vi = {
  urlCopyNotice: 'Đã sao chép đường dẫn bài viết',
  language: {
    original: 'Ngôn ngữ gốc',
    translated: 'Bản dịch',
    unsupported: `Bài viết đang hiện thị với ngôn ngữ gốc vì chưa được dịch sang ngôn ngữ bạn đã chọn. Nếu có thể, hay tham gia <a href="${SOCIAL_LINKS.github}" class="c-link" target="_blank" rel="noreferrer">Github</a> và <a href="${SOCIAL_LINKS.discord}" class="c-link" target="_blank" rel="noreferrer">Discord</a> để hỗ trợ dịch bài bạn nhé. Xin cảm ơn!`,
  },
  readMinutes: 'phút đọc',
  tableOfContents: {
    title: 'Mục lục',
    linkLabelToTitle: 'Tiêu đề',
  },
  share: 'Chia sẻ',
  editLink: {
    intro: 'Bạn tìm thấy lỗi chính ta hay cần đính chính nội dung?',
    label: 'Sửa trang này tại Github',
  },
};
