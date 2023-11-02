import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

export const vi = {
  title: 'Tài trợ',
  subtitle: 'Duy trì sáng tạo',
  how: {
    title: 'Làm sao để tài trợ cho Svelte Việt Nam?',
    description:
      'Svelte Vietnam chọn <a class="c-link font-bold" href="https://docs.opencollective.com/help/about/introduction" target="_blank" rel="noreferrer">Open Collective</a> để nhận đóng góp tài chính từ nhà tài trợ (cá nhân hoặc tổ chức). Đây là nền tảng có tính minh bạch cao: mọi đóng góp (tiền vào) và chi tiêu (tiền ra) đều là công khai.',
    contribute:
      'Nếu bạn không có điều kiện để hỗ trợ tài chính hoặc muốn đóng góp trực tiếp hơn cho cộng đồng Svelte Việt Nam, hãy xem qua các kênh dưới đây. Xin cảm ơn!',
    ctas: {
      sponsor: 'Tài trợ Svelte Việt Nam thông qua Open Collective',
      discord: 'Gặp gỡ cộng đồng qua Discord của Svelte Việt Nam',
      email: `Gởi thắc mắc đến <em>${EMAILS.SPONSOR}</em>`,
      events: 'Giúp tổ chức hoặc cung cấp địa điểm cho các sự kiện',
      blog: 'Chia sẻ sản phẩm, ý tưởng, kinh nghiệm qua Blog',
      github: 'Tham gia các dự án tại Github',
    },
  },
  why: {
    title: 'Tại sao Svelte Việt Nam cần tài trợ?',
    description:
      'Svelte Việt Nam không phải là một doanh nghiệp và không có dự định kinh tế hóa các dự án hay sản phẩm. Tuy nhiên, Svelte Việt Nam cần có kinh phí để xây dựng một cộng đồng lành mạnh và khuyến khích thành viên gắn kết, cùng phát triển thông qua các sự kiện và diễn đàn. Để hiểu rõ hơn định hướng phát triển của Svelte Việt Nam, hãy đọc qua bài viết "<a class="c-link" href="/blog/20231012-svelte-vietnam-from-local-to-global">Svelte Việt Nam: từ vườn nhà vươn ra thế giới</a>".',
    for: {
      description: 'Cụ thể, Svelte Việt Nam sẽ sử dụng kinh phí từ quỹ tài trợ để:',
      bullets: {
        maintain:
          '<strong>Duy trì</strong> một hạ tầng ổn định (Cloudflare). Hiện tại Svelte Việt Nam được xây dựng dựa vào các nỗ lực cá nhân và tài chính tự nguyện. Có kinh phí có nghĩa là thành viên sẽ không phải tự chi trả cho khoản này.',
        create:
          '<strong>Sáng tạo</strong> các hoạt động và sự kiện để thành viên có thể gặp gỡ, kết nối, khuyến khích một tư duy cộng đồng, chia sẻ, đồng phát triển.',
      },
    },
    inspect: `Như đã đề cập ở <a href="#how" class="c-link">phần trên</a>, danh sách nhà tài trợ, cũng như các khoản thu, chi đều được lưu trữ một cách công khai tại <a class="c-link" href="${SOCIAL_LINKS.OPEN_COLLECTIVE}" target="_blank" rel="noreferrer noopener">Open Collective của Svelte Việt Nam</a>.`,
  },
  benefits: {
    title: 'Tôi được gì khi tài trợ cho Svelte Việt nam?',
    description:
      'Nhà tài trợ sẽ được liệt kệ tại trang web này, cũng như trong các dự án và sự kiện của Svelte Việt Nam. Trong tương lai gần khi trang “Việc làm” đã được hoàn thiện, nhà tài trợ sẽ được ưu tiên trong quy trình đăng tuyển dụng. Ngoài ra, Svelte Việt Nam cũng dành nhiều cơ hội trong các sự kiện cho nhà tài trợ để quản bá thương hiệu, tổ chức, sản phẩm của họ.',
  },
};
