import {
  BLOG_PATH,
  CODE_OF_CONDUCT_PATH,
  DESIGN_PATH,
  EVENTS_PATH,
  HOME_PATH,
  JOBS_PATH,
  ROADMAP_PATH,
  SPONSOR_PATH,
} from '$shared/services/navigation';

export const vi = {
  title: 'Lộ trình',
  subtitle: 'Kế hoạch phát triển trang web sveltevietnam.dev',
  common: {
    milestone: 'Cột mốc',
    objective: 'Mục tiêu',
    tasks: 'Công việc chính',
  },
  milestones: {
    aulac: {
      title: 'Âu Lạc',
      objective: 'khởi tạo dự án, xây dựng hạ tầng, và thiết lập một quy trình phát triển cơ bản',
      primaryTasks: [
        '☑ Khởi tạo Github <a class="c-link" href="https://github.com/sveltevietnam" rel="noreferrer" target="_blank">organization</a>, <a class="c-link" href="https://github.com/orgs/sveltevietnam/projects/1" rel="noreferrer" target="_blank">project</a>, và <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev" rel="noreferrer" target="_blank">sveltevietnam.dev repository</a>',
        '☑ Công bố văn bản “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/PROJECT_REFERENCES.md" rel="noreferrer" target="_blank">Project Reference</a>” giới thiệu tổng quan về dự án Svelte Việt Nam',
        `☑ Thiết kế và tích hợp <a class="c-link" href="${DESIGN_PATH}">logo chính thức của Svelte Việt Nam</a>`,
        '☑ Khởi tạo <a class="c-link" href="https://github.com/sveltevietnam/branding" rel="noreferrer" target="_blank">branding repository</a> để lưu trữ các phiên bản logo và văn bản “Branding Guidelines" (bàn về việc sử dụng logo và các hình ảnh của Svelte Việt Nam)',
        `☑ Ra mắt <a class="c-link" href="${HOME_PATH}">Trang chủ</a> với thiết kế sơ khởi`,
        '☑ Thiết lập websocket service và bot cho Discord server, định hướng phát triển dần để nâng cao trải nghiệm thành viên tại cả Discord và trang web sveltevietnam.dev',
        '☑ Thiết lập metadata và SEO cơ bản, bao gồm <a class="c-link" href="https://sveltevietnam.dev/sitemap.xml" rel="noreferrer" target="_blank">sitemap.xml</a>, Google Search Console, Google Analytics',
        `☑ Ra mắt trang <a class="c-link" href="${ROADMAP_PATH}">Lộ trình</a>`,
      ],
    },
    tu: {
      title: 'Tự',
      objective:
        'chuẩn bị cho phiên bản chính thức đầu tiên của sveltevietnam.dev (v1.0.0), tập trung phát triển trang blog, trang sự kiện, các tính năng và nội dung cần thiết để cộng đồng có thể bắt đầu tham gia và đóng góp một cách chủ động hơn.',
      primaryTasks: [
        `☑ Ra mắt trang <a class="c-link" href="${CODE_OF_CONDUCT_PATH}">Quy tắc ứng xử</a> với thiết kế sơ khởi`,
        `☑ Thiết kế hạ tầng và khởi tạo <a class="c-link" href="https://mailer.sveltevietnam.dev" target="_blank" rel="noreferrer">service mailer</a> để quản lý hệ thống người dùng đăng kí nhận thông báo qua email`,
        `☑ Ra mắt trang <a class="c-link" href="${EVENTS_PATH}">Sự kiện</a> với thiết kế sơ khởi`,
        `☑ Ra mắt trang <a class="c-link" href="${BLOG_PATH}">Blog</a> với thiết kế sơ khởi`,
        `☑ Hoàn thiện văn bản “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/TECHNICAL_REFERNCES.md" rel="noreferrer" target="_blank">Technical Reference</a>” và “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/CONTRIBUTING.md" rel="noreferrer" target="_blank">Contributing Guidelines</a>”`,
        '☑ Thiết lập quy trình đăng bài hoặc liên kết bài viết thông qua <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/issues/new/choose" rel="noreferrer" target="_blank">Github issue</a> và <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md" rel="noreferrer" target="_blank">hướng dẫn code trực tiếp bài viết</a>',
        '☐ Thiết kế “Khảo sát Cộng đồng Svelte Việt Nam 2023”',
      ],
      secondaryTasks: {
        title: 'Công việc liên quan và liên kết với cột mốc sau',
        items: [
          `☐ Ra mắt trang <a class="c-link" href="${SPONSOR_PATH}">Tài trợ</a> với thiết kế sơ khởi`,
          '☐ Gởi yêu cầu thành lập Open Collective của Svelte Việt Nam',
        ],
      },
    },
    dong: {
      title: 'Đồng',
      objective:
        'xây dựng hạ tầng và quy trình đăng tuyển, tổng hợp việc làm liên quan đến Svelte hoặc Front-end.',
      primaryTasks: [
        '☐ Phát triển web scraper và cron job để tổng hợp công việc tự động',
        `☐ Ra mắt trang <a class="c-link" href="${JOBS_PATH}">Việc làm</a> với thiết kế sơ khởi`,
        '☐ Thiết lập quy trình đăng tuyển việc làm dành riêng cho nhà tài trợ',
      ],
    },
  },
};
