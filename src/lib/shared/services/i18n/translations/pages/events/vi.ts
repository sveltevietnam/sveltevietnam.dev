import { EMAILS } from '$shared/constants';

export const vi = {
  title: 'Sự kiện',
  subtitle: 'Gặp gỡ, trao đổi, chia sẻ về Svelte và open source',
  upcomingEvents: {
    title: 'Sự kiện mới',
  },
  actions: {
    share: {
      title: 'Chia sẻ',
      description:
        'Đăng kí trở thành diễn giả trong các buổi gặp mặt kế tiếp để chia sẻ kinh nghiệm hoặc sản phẩm của bạn',
      cta: `Email <em>${EMAILS.events}</em>`,
    },
    participate: {
      title: 'Tham gia',
      description: 'Đăng kí nhận thông báo và thông tin về các buổi gặp mặt của Svelte Vietnam',
      form: {
        name: 'Tên',
        cta: 'Đăng kí',
      },
    },
    discord: {
      cta: 'Sự kiện đã diễn ra',
    },
    sponsor: {
      title: 'Tài trợ',
      description:
        'Trở thành nhà tài trợ của Svelte Vietnam để có cơ hội giới thiệu thương hiệu và củng cố mốt quan hệ với cộng đồng open source.',
      cta: 'Trở thành nhà tài trợ',
      whyNeedSponsor: 'Tại sao Svelte Vietnam cần tài trợ?',
    },
  },
  pastEvents: {
    title: 'Sự kiện đã diễn ra',
  },
};
