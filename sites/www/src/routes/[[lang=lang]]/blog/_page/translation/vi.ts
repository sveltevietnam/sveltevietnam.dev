import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

export const vi = {
  title: 'Blog',
  subtitle: 'Học để chia sẻ. Sẻ chia là học',
  recent: {
    title: 'Bài viết gần đây',
  },
  introduction: {
    title: 'Giới thiệu',
    description: [
      'Đây là nơi để thành viên Svelte Việt Nam chia sẻ và lan rộng kiến thức, ý tưởng, cảm nhận của mình qua các trải nghiệm với open source và cộng đồng Svelte trên khắp thế giới.',
      'Bạn có thể bắt gặp một số khác biệt về phương thức và quy trình vận hành của blog so với các hệ thống khác. Đọc thêm “<a href="#" class="c-link">Behind the Screen: blog chạy bằng cơm (và code)</a>” để hiểu thêm những quyết định đằng sau thiết kế hạ tầng của trang Blog Svelte Việt Nam.',
      'Tham gia <a class="c-link" href="https://discord.sveltevietnam.dev" target="_blank" rel="noreferrer">Discord Svelte Việt Nam</a> để thảo luận trực tiếp hơn với cộng đồng và ban quản trị về các vấn đề xoay quanh việc viết blog. ',
    ],
  },
  contribute: {
    title: 'Đăng bài',
    description:
      'Svelte Việt Nam hoan nghênh tất cả mọi người đăng bài hoặc liên kết bài viết của mình tại blog này. Đây là cách thiết thực và trực tiếp nhất mà thành viên có thể đóng góp vào sự phát triển chung của cả cộng đồng. Tham khảo các đường dẫn bên dưới để bắt đầu!',
    links: {
      proposePost: 'Gởi đề xuất đăng bài (Github issue)',
      requestExternalPost: 'Gởi yêu cầu liên kết bài viết ngoài (Github issue)',
      readCodeGuidelines: 'Đọc hướng dẫn code bài trực tiếp',
    },
    contact: `Nếu bạn không sử dụng Github, hãy liên hệ với ban quản trị qua <a class="c-link" href="${SOCIAL_LINKS.discord}" target="_blank" rel="noreferrer">Discord</a> hoặc hòm thư <a class="c-link" href="mailto:${EMAILS.blog}" target="_blank" rel="noreferrer">${EMAILS.blog}</a>.`,
  },
  posts: {
    title: 'Bài viết',
    tba: {
      description: 'Chưa có bài viết nào.',
      cta: 'Gởi đề xuất đăng bài',
    },
  },
  externalPosts: {
    title: 'Liên kết',
    tba: {
      description: 'Chưa có bài viết nào.',
      cta: 'Gởi yêu cầu liên kết bài viết của bạn',
    },
  },
  mail: {
    description: 'Đăng kí nhận thông báo khi có bài viết mới',
  },
};
