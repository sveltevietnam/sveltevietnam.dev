import { BaseTemplateVars } from '../mjml/templates';

export function createLogoImageUrl(origin: string) {
	return `${origin}/mails/logo.png`;
}

export function createSocials(origin: string): BaseTemplateVars['socials'] {
	return {
		discord: {
			imgUrl: origin + '/mails/socials/discord.png',
			href: 'https://discord.gg/Rtv2xwhz7d',
			label: 'Discord',
		},
		bluesky: {
			imgUrl: origin + '/mails/socials/bluesky.png',
			href: 'https://bsky.app/profile/sveltevietnam.dev',
			label: 'Bluesky',
		},
		github: {
			imgUrl: origin + '/mails/socials/github.png',
			href: 'https://github.com/sveltevietnam',
			label: 'GitHub',
		},
		openCollective: {
			imgUrl: origin + '/mails/socials/open-collective.png',
			href: 'https://opencollective.com/sveltevietnam',
			label: 'Open Collective',
		},
		facebook: {
			imgUrl: origin + '/mails/socials/facebook.png',
			href: 'https://facebook.com/sveltevietnam',
			label: 'Facebook',
		},
		youtube: {
			imgUrl: origin + '/mails/socials/youtube.png',
			href: 'https://www.youtube.com/@sveltevietnam',
			label: 'YouTube',
		},
	};
}

type Calendar = 'google' | 'microsoft' | 'yahoo';
export function createCalendars(origin: string, links: Record<Calendar, string>) {
	return {
		google: {
			imgUrl: origin + '/mails/calendars/google.png',
			label: 'Google Calendar',
			href: links.google,
		},
		microsoft: {
			imgUrl: origin + '/mails/calendars/microsoft.png',
			label: 'Outlook Calendar',
			href: links.microsoft,
		},
		yahoo: {
			imgUrl: origin + '/mails/calendars/yahoo.png',
			label: 'Yahoo Calendar',
			href: links.yahoo,
		},
	};
}
