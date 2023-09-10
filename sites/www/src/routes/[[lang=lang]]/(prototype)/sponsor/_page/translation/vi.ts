import { EMAILS } from '$shared/constants';

export const vi = {
  title: 'Tài trợ',
  intro:
    'Svelte Việt Nam chọn <a class="c-link font-bold" href="https://docs.opencollective.com/help/about/introduction" target="_blank" rel="noreferrer">Open Collective</a> để nhận đóng góp tài chính từ nhà tài trợ (cá nhân hoặc tổ chức) vì nền tảng này hỗ trợ tốt cho các dự án open source, đồng thời cung cấp sự minh bạch trong quản lý tài chính: mọi đóng góp (tiền vào) và chi tiêu (tiền ra) đều được lưu trữ và hiển thị công khai.',
  ctas: {
    sponsor: 'Tài trợ thông qua Open Collective',
    question: `Gởi thắc mắc đến <em>${EMAILS.sponsor}</em>`,
  },
  why: {
    title: 'Vì sao Svelte Việt Nam cần tài trợ?',
    description:
      'Svelte Việt Nam được hiện thực hoá bằng nhiều nỗ lực cá nhân: duy trì hạ tầng và nội dung trang web, tổ chức sự kiện, chia sẻ qua diễn đàn, đóng góp vào các dự án open source, phi lợi nhuận, ... và thường đến từ những thành viên có công việc và gia đình riêng. Hỗ trợ tài chính sẽ giúp giảm bớt các chi phí không tránh khỏi và tạo động lực cho những nỗ lực mang nhiều giá trị như vậy.<br/><br/>Ngoài tài chính, cá nhân và tổ chức có điều kiện còn có thể hỗ trợ trong việc tổ chức, cung cấp địa điểm cho các sự kiện, buổi gặp mặt của Svelte Việt Nam, và cùng lan truyền tư duy open source và thói quen chia sẻ trong cộng đồng công nghệ tại Việt Nam.',
  },
  sponsors: {
    cta: 'Xem báo cáo tài chính và danh sách nhà tài trợ tại Open Collective',
  },
};
