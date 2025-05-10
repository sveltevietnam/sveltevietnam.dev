import { defineBlogSeries } from '..';

export default defineBlogSeries((lang) => ({
	name: 'Behind the Screen',
	slug: 'behind-the-screen',
	...{
		en: {
			description:
				'Sharing about technical decisions behind the codebase, infrastructure, and user interface of sveltevietnam.dev',
		},
		vi: {
			description:
				'Chia sẻ về các quyết định kỹ thuật đằng sau codebase, hạ tầng và giao diện trang web sveltevietnam.dev',
		},
	}[lang],
}));
