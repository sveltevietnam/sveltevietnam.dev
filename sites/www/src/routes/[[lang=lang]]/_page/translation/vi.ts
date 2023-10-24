import { SOCIAL_LINKS } from '$shared/constants';
import { SPONSOR_PATH } from '$shared/services/navigation';

export const vi = {
  intro: {
    title: 'Giới thiệu',
    svelte:
      'Là công nghệ phát triển giao diện, giúp tạo ra trải nghiệm tốt cho người dùng mà không cần đánh đổi hiệu suất của lập trình viên',
    vietnam:
      'Là trung tâm công nghệ đang phát triển nhanh với nhiều lập trình viên ưu tú và ngày càng nhiều đầu tư vào chuyển đổi số và các công nghệ bền vững',
    sveltevietnam:
      'Là kênh thông tin tổng hợp và cộng đồng dành cho bất cứ ai quan tâm đến sự phát triển của Svelte tại Việt Nam',
  },
  community: {
    title: 'Cộng đồng',
    description: `Tham gia <a class="c-link" href=${SOCIAL_LINKS.discord} target="_blank" rel="noreferrer">Discord của Svelte Việt Nam</a> để cùng giao lưu, trao đổi thông tin, hỏi đáp, và hỗ trợ nhau.<br>Để đóng góp vào mã nguồn của trang web này hoặc các dự án open source từ Svelte Việt Nam, truy cập trang <a class="c-link" href="${SOCIAL_LINKS.github}" target="_blank" rel="noreferrer">Github của Svelte Việt Nam</a>.`,
    ctas: {
      discord: 'Tham gia ngay tại Discord',
      nominate: 'Đề cử thành viên tiêu biểu',
      contribute: 'Đóng góp tại Github',
    },
  },
  events: {
    title: 'Sự kiện sắp tới',
    description:
      'Gặp gỡ, cùng nhau chia sẻ kinh nghiệm, sản phẩm, và mọi thứ liên quan đến Svelte và open source',
    tba: {
      description: 'Chưa có sự kiện nào',
      cta: 'Đăng ký cập nhật sự kiến mới nhất',
    },
  },
  posts: {
    title: 'Bài viết',
    description: `Ngoài <a class="c-link" href=${SOCIAL_LINKS.discord} target="_blank" rel="noreferrer">Discord</a>, Blog của Svelte Việt Nam là kênh chia sẻ chính thống và thiết thực nhất.`,
  },
  jobs: {
    title: 'Việc làm mới',
    description: 'Chia sẻ hoặc ứng tuyển vào các công việc liên quan đến Svelte',
  },
  impact: {
    title: 'Dự án',
    description:
      'Chia sẻ hoặc tham gia các dự án phi lợi nhuận hoặc open source để góp phần tạo nên thay đổi tích cực',
    by: 'Bởi',
  },
  sponsor: {
    title: 'Nhà tài trợ',
    description:
      'Giúp cộng đồng Svelte Việt Nam phát triển bền vững bằng cách trở thành nhà tài trợ',
    tba: {
      description: 'Nhà tài trợ sẽ được liệt kê tại đây',
      cta: `Tìm hiểu thêm`,
    },
  },
};
