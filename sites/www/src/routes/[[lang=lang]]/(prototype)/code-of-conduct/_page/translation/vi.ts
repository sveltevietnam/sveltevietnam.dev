import { EMAILS } from '$shared/constants';

export const vi = {
  title: 'Quy tắc ứng xử',
  notice: {
    description:
      'Mọi thành viên (cá nhân hoặc tổ chức) tham gia cộng đồng Svelte Việt Nam cần tuân theo các quy tắc ứng xử đã được đề ra trong văn bản “Code of Conduct” của <a href="https://github.com/sveltejs/community/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noreferrer" class="c-link">sveltejs/community</a> và <a href="https://sveltesociety.dev/about" target="_blank" rel="noreferrer" class="c-link">Svelte Society</a>.',
    action: 'Vui lòng gởi khiếu nại, góp ý, và thắc mắc thông qua các kênh dưới đây. Xin cảm ơn!',
    ctas: {
      discord: 'Liên hệ với quản trị qua Discord',
      email: `Email <em>${EMAILS.coc}</em>`,
    },
  },
  excerpt: {
    intro:
      'Dưới đây là bản dịch phần tóm tắt của văn bản Code of Conduct từ Svelte Society. Để tránh dài dòng và sai sót về ngôn ngữ, các văn bản đã nêu sẽ không được dịch toàn bộ. Hãy tham khảo bản gốc để biết thêm chi tiết.',
    quote:
      'Svelte Society nỗ lực để xây dựng một cộng đồng <strong>không có quấy rối đến bất kì ai</strong> bất kể giới tính, bản dạng và thể hiện giới, xu hướng tình dục, khuyết tật, ngoại hình, tuổi tác, chủng tộc, quốc tịch, hoặc tôn giáo, tính ngưỡng. <strong>Chúng tôi không khoan dung cho các hành vi quấy rối đến thành viên dưới mọi hình thức</strong>. Cá nhân hoặc tổ chức vi phạm các quy tắc này có thể bị xử phạt hoặc loại khỏi cộng đồng dựa theo quyết định từ ban quản trị của Svelte Society.<br/><br/>Người tham gia, diễn giả, nhà tài trợ, người hướng dẫn, và tình nguyện viên tại các sự kiện của chúng tôi phải đồng ý với những quy tắc ứng xử. Ban quản trị sẽ luôn thực thi những quy tắc này. Chúng tôi mong đợi sự hợp tác từ tất cả mọi người để bảo đảm một môi trường an toàn.',
    caption: 'Svelte Society, <cite class="font-bold">TL;DR - Code of Conduct</cite>',
  },
};
