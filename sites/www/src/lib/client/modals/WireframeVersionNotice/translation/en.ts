import { GITHUB_LINKS } from '$shared/constants';

export const en = {
	title: 'Under Construction',
	description: `You are seeing the wireframe version of the official Svelte Vietnam website. The project is in active design and development.<br/>For more information, see For more information, see <a href=${GITHUB_LINKS.PROJECT_REFERENCES} class="c-link" target="_blank" rel="noreferrer">Project References</a>. Roadmap and progress can be tracked at <a href=${GITHUB_LINKS.PROJECT} class="c-link" target="_blank" rel="noreferrer">project sveltevietnam.dev</a>.`,
	feedbacks: `We welcome any <a href=${GITHUB_LINKS.DISCUSSION} class="c-link" target="_blank" rel="noreferrer">feedbacks and contributions</a >. Thank you for stopping by.`,
	ctas: {
		continue: 'Take me in',
		doNotShowAgain: 'Do not show again',
	},
} satisfies typeof import('./vi').vi;
