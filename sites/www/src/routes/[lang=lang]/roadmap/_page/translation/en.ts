import { SOCIAL_LINKS } from '$shared/constants';
import {
	BLOG_PATH,
	CODE_OF_CONDUCT_PATH,
	DESIGN_BLOG_PATH,
	DESIGN_COLORS_PATH,
	DESIGN_PATH,
	DESIGN_TYPOGRAPHY_PATH,
	EVENTS_PATH,
	HOME_PATH,
	JOBS_PATH,
	ROADMAP_PATH,
	SITEMAP_PATH,
	SPONSOR_PATH,
} from '$shared/services/navigation';

export const en = {
	title: 'Roadmap',
	subtitle: 'Development plan for sveltevietnam.dev site',
	common: {
		milestone: 'Milestone',
		objective: 'Objective',
		tasks: 'Primary tasks',
	},
	milestones: {
		aulac: {
			title: 'Âu Lạc',
			objective: 'bootstrap project, infrastructure, and basic development processes',
			primaryTasks: [
				'☑ Set up Github <a class="c-link" href="https://github.com/sveltevietnam" rel="noreferrer" target="_blank">organization</a>, <a class="c-link" href="https://github.com/orgs/sveltevietnam/projects/1" rel="noreferrer" target="_blank">project</a>, and <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev" rel="noreferrer" target="_blank">sveltevietnam.dev repository</a>',
				'☑ Introduce the “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/PROJECT_REFERENCES.md" rel="noreferrer" target="_blank">Project Reference</a>” document that provides an overview of the Svelte Vietnam project',
				`☑ Design and integrate <a class="c-link" href="${DESIGN_PATH}">the official logo for Svelte Vietnam</a>`,
				'☑ Set up <a class="c-link" href="https://github.com/sveltevietnam/branding" rel="noreferrer" target="_blank">branding repository</a> to store public assets (including logo with version history) and the “Branding Guidelines" document (discussing about usage of Svelte Vietnam\'s public assets)',
				`☑ Introduce the <a class="c-link" href="${HOME_PATH}">Home</a> page with basic design`,
				'☑ Develop websocket service and bot for Discord server, making ways to gradually add new features to enrich experience for users on both Discord and the sveltevietnam.dev site',
				`☑ Set up basic metadata and SEO, including <a class="c-link" href="${SITEMAP_PATH}" rel="noreferrer" target="_blank">sitemap.xml</a>, Google Search Console, Google Analytics`,
				`☑ Introduce this <a class="c-link" href="${ROADMAP_PATH}">Roadmap</a> page`,
			],
		},
		tu: {
			title: 'Tự',
			objective:
				'prepare for the first official release of sveltevietnam (v1.0.0), focusing on developing blog and events pages, as well as necessary features and content for the community to start participating and contributing more actively.',
			primaryTasks: [
				`☑ Publish the <a class="c-link" href="${CODE_OF_CONDUCT_PATH}">Code of Conduct</a> page with basic design`,
				`☑ Design the infrastructure and bootstrap <a class="c-link" href="https://mailer.sveltevietnam.dev" target="_blank" rel="noreferrer">mailer service</a> to manage user subscriptions for email notifications`,
				`☑ Publish the <a class="c-link" href="${EVENTS_PATH}">Events</a> page with basic design`,
				`☑ Publish the <a class="c-link" href="${BLOG_PATH}">Blog</a> page with basic design`,
				`☑ Introduce the “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/TECHNICAL_REFERNCES.md" rel="noreferrer" target="_blank">Technical Reference</a>” and “<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/CONTRIBUTING.md" rel="noreferrer" target="_blank">Contributing Guidelines</a>” documents`,
				'☑ Set up processes to publish blog posts or link posts via <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/issues/new/choose" rel="noreferrer" target="_blank">Github issue</a>, and <a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/docs/DEV_BLOG_POST.md" rel="noreferrer" target="_blank">guidelines for coding blog posts</a>',
				'☑ Set up dedicated Open Graph images for all current pages',
				'☑ Support progressive enhancement (solution or fallback for users without Javascript), especially for critical features including i18n routing, color theme switching, mobile header nav menu, and splash screen',
				`☑ Introduce the <a class="c-link" href="${DESIGN_PATH}">Design</a> page group that documents the design details of Svelte Vietnam, including logo, <a class="c-link" href="${DESIGN_TYPOGRAPHY_PATH}">typography</a>, <a class="c-link" href="${DESIGN_COLORS_PATH}">colors</a>, and <a class="c-link" href="${DESIGN_BLOG_PATH}">blog</a>`,
				'☑ Organize the <a class="c-link" href="/events/202312-year-end-online-meetup">first online community meetup</a>',
				'☐ Draft content and design for “Svelte Vietnam Community 2023 Survey”',
			],
			secondaryTasks: {
				title: 'Related tasks as preparation for the next milestone',
				items: [
					`☑ Publish the <a class="c-link" href="${SPONSOR_PATH}">Sponsors</a> page with basic design`,
					`☑ Send request to create <a class="c-link" href="${SOCIAL_LINKS.OPEN_COLLECTIVE}" target="_blank" rel="noreferrer">Svelte Vietnam's Open Collective</a>`,
				],
			},
		},
		dong: {
			title: 'Đồng',
			objective:
				'build infrastructure and processes for posting and scraping jobs related to Svelte or Front-end.',
			primaryTasks: [
				`☑ Publish the <a class="c-link" href="${JOBS_PATH}">Jobs</a> page with basic design`,
				'☐ Develop a web scarper and cron job to automatically find related jobs',
				'☐ Set up processes for sponsors to post and link jobs',
			],
		},
	},
} satisfies typeof import('./vi').vi;
