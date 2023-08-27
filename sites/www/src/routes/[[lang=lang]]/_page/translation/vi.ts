import { SOCIAL_LINKS } from '$shared/constants';

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
    description: `Tham gia <a class="c-link" href=${SOCIAL_LINKS.discord} target="_blank" rel="noreferrer">Discord của Svelte Vietnam</a> để cùng giao lưu, trao đổi thông tin, hỏi đáp, và hỗ trợ nhau.<br>Để đóng góp vào mã nguồn của trang web này hoặc các dự án open source từ Svelte Vietnam, truy cập trang <a class="c-link" href="${SOCIAL_LINKS.github}" target="_blank" rel="noreferrer">Github của Svelte Vietnam</a>.`,
    ctas: {
      discord: 'Tham gia ngay tại Discord',
      nominate: 'Đề cử thành viên tiêu biểu',
      contribute: 'Đóng góp tại Github',
    },
  },
  events: {
    title: 'Sự kiện sắp tới',
    description: 'Gặp gỡ, cùng nhau chia sẻ kinh nghiệm, sản phẩm, và mọi thứ liên quan đến Svelte',
    ctas: {
      viewMore: 'Xem thêm',
    },
  },
  jobs: {
    title: 'Việc làm mới',
    description: 'Chia sẻ hoặc ứng tuyển vào các công việc liên quan đến Svelte',
    ctas: {
      viewMore: 'Xem thêm',
    },
  },
  impact: {
    title: 'Dự án',
    description:
      'Chia sẻ hoặc tham gia các dự án phi lợi nhuận hoặc open source để góp phần tạo nên thay đổi tích cực',
    by: 'Bởi',
    ctas: {
      viewMore: 'Xem thêm',
    },
  },
  sponsor: {
    title: 'Nhà tài trợ',
    description:
      'Giúp cộng đồng Svelte Vietnam phát triển bền vững bằng cách trở thành nhà tài trợ',
    ctas: {
      viewMore: 'Xem thêm',
    },
  },
};
