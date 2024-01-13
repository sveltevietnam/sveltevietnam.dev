import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

export const vi = {
	title: 'Việc làm',
	subtitle:
		'Dành cho lập trình viên Svelte, đăng tuyển bởi các nhà tài trợ và tổng hợp từ một số kênh tuyển dụng',
	fromSponsors: {
		title: 'Từ nhà tài trợ',
		cta: 'Trở thành nhà tài trợ',
		tba: {
			description: 'Chưa có công việc nào.',
			cta: 'Tài trợ cho Svelte Việt Nam để đăng tuyển.',
		},
	},
	actions: {
		title: 'Hành động',
		recruiter: {
			title: 'Nhà tuyển dụng',
			description:
				'Cá nhân và tổ chức đã tài trợ cho Svelte Việt Nam có cơ hội đăng tuyển trực tiếp trên trang web này.',
			cta: 'Trở thành nhà tài trợ',
			whyNeedSponsor: 'Tại sao Svelte Việt Nam cần tài trợ?',
			steps: {
				sponsor: `Tài trợ Svelte Việt Nam thông qua <a class="c-link" href=${SOCIAL_LINKS.OPEN_COLLECTIVE} rel="noreferrer" target="_blank">Open Collective</a>.`,
				contact: `Liên hệ với ban quản trị thông qua <a class="c-link" href="${SOCIAL_LINKS.DISCORD}" hrel="noreferrer" target="_blank">Discord</a> hoặc <a class="c-link" href="mailto:${EMAILS.JOBS}" rel="noreferrer" target="_blank">${EMAILS.JOBS}<a/> để đăng tuyển.`,
			},
		},
		candidate: {
			title: 'Ứng viên',
			description:
				'Đăng kí nhận thông báo khi có cập nhật đăng tuyển hoặc thông tin về việc làm liên quan đến Svelte',
		},
	},
	fromRecruitmentSites: {
		title: 'Từ kênh tuyển dụng',
		collectedAt: 'Tổng hợp từ các kênh tuyển dụng phổ biến tại Việt Nam vào lúc',
		notice:
			'Tính năng đang được phát triển để tự động tổng hợp việc làm từ các kênh tuyển dụng phổ biến tại Việt Nam. Xem <a class="c-link" href="/vi/lo-trinh">Roadmap</a> để biết thêm chi tiết.',
		tba: {
			description: 'Chưa tìm thấy công việc nào.',
			cta: 'Đăng ký cập nhật công việc mới nhất.',
		},
	},
};
