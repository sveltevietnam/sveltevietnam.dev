import { SOCIAL_LINKS } from '$lib/constants';

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
				'☑ Thiết kế và tích hợp <a class="c-link" href="/vi/thiet-ke">logo chính thức của Svelte Việt Nam</a>',
				'☑ Khởi tạo <a class="c-link" href="https://github.com/sveltevietnam/branding" rel="noreferrer" target="_blank">branding repository</a> để lưu trữ các phiên bản logo và văn bản “Branding Guidelines" (bàn về việc sử dụng logo và các hình ảnh của Svelte Việt Nam)',
				'☑ Ra mắt <a class="c-link" href="/vi">Trang chủ</a> với thiết kế sơ khởi',
				'☑ Thiết lập websocket service và bot cho Discord server, định hướng phát triển dần để nâng cao trải nghiệm thành viên tại cả Discord và trang web sveltevietnam.dev',
				'☑ Thiết lập metadata và SEO cơ bản, bao gồm <a class="c-link" href="/sitemap.xml" rel="noreferrer" target="_blank">sitemap.xml</a>, Google Search Console, Google Analytics',
				'☑ Ra mắt trang <a class="c-link" href="/vi/lo-trinh">Lộ trình</a>',
			],
		},
		tu: {
			title: 'Tự',
			objective:
				'chuẩn bị cho phiên bản chính thức đầu tiên của sveltevietnam.dev (v1.0.0), tập trung phát triển trang blog, trang sự kiện, các tính năng và nội dung cần thiết để cộng đồng có thể bắt đầu tham gia và đóng góp một cách chủ động hơn.',
			primaryTasks: [
				'☑ Ra mắt trang <a class="c-link" href="/vi/quy-tac-ung-xu">Quy tắc ứng xử</a> với thiết kế sơ khởi',
				'☑ Thiết kế hạ tầng và khởi tạo <a class="c-link" href="https://mailer.sveltevietnam.dev" target="_blank" rel="noreferrer">service mailer</a> để quản lý hệ thống người dùng đăng kí nhận thông báo qua email',
				'☑ Ra mắt trang <a class="c-link" href="/vi/su-kien">Sự kiện</a> với thiết kế sơ khởi',
				'☑ Ra mắt trang <a class="c-link" href="/vi/blog">Blog</a> với thiết kế sơ khởi',
				'☑ Hoàn thiện văn bản “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/TECHNICAL_REFERNCES.md" rel="noreferrer" target="_blank">Technical Reference</a>” và “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/CONTRIBUTING.md" rel="noreferrer" target="_blank">Contributing Guidelines</a>”',
				'☑ Thiết lập quy trình đăng bài hoặc liên kết bài viết thông qua <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/issues/new/choose" rel="noreferrer" target="_blank">Github issue</a> và <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md" rel="noreferrer" target="_blank">hướng dẫn code trực tiếp bài viết</a>',
				'☑ Thiết lập hình Open Graph riêng cho mỗi trang đã hoàn thiện',
				'☑ Hỗ trợ cho người dùng không truy cập được Javascript (cải tiến tăng dần), đặc biệt đối với các tính năng thiết yếu như điều hướng đa ngôn ngữ, thay đổi chế độ giao diện, menu trên di động, và màn hình chờ',
				'☑ Giới thiệu nhóm trang <a class="c-link" href="/vi/thiet-ke">Thiết kế</a> ghi lại các chi tiết thiết kế của Svelte Việt Nam, bao gồm logo, <a class="c-link" href="/vi/thiet-ke/chu-viet">chữ viết</a>, <a class="c-link" href="/vi/thiet-ke/mau-sac">màu sắc</a>, và <a class="c-link" href="/vi/thiet-ke/blog">blog</a>',
				'☑ Tổ chức <a class="c-link" href="/events/202312-year-end-online-meetup">buổi gặp mặt cộng đồng trực tuyến đầu tiên</a>',
				'☐ Sơ thảo nội dung và thiết kế cho “Khảo sát Cộng đồng Svelte Việt Nam 2023”',
			],
			secondaryTasks: {
				title: 'Công việc liên quan và liên kết với cột mốc sau',
				items: [
					'☑ Ra mắt trang <a class="c-link" href="/vi/tai-tro">Tài trợ</a> với thiết kế sơ khởi',
					`☑ Gởi yêu cầu thành lập <a class="c-link" href="${SOCIAL_LINKS.OPEN_COLLECTIVE}" target="_blank" rel="noreferrer">Open Collective của Svelte Việt Nam</a>`,
				],
			},
		},
		dong: {
			title: 'Đồng',
			objective:
				'xây dựng hạ tầng và quy trình đăng tuyển, tổng hợp việc làm liên quan đến Svelte hoặc Front-end.',
			primaryTasks: [
				'☑ Ra mắt trang <a class="c-link" href="/vi/cong-viect">Việc làm</a> với thiết kế sơ khởi',
				'☐ Phát triển web scraper và cron job để tổng hợp công việc tự động',
				'☐ Thiết lập quy trình đăng tuyển việc làm dành riêng cho nhà tài trợ',
			],
		},
	},
};
