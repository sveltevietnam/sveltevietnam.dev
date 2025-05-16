import { BaseTemplateVars } from '$/mjml/templates';

export function createLogoImageUrl(origin: string) {
	return `${origin}/images/logo.png`;
}

export function createSocials(origin: string): BaseTemplateVars['socials'] {
	return {
		discord: {
			imgUrl: origin + '/images/socials/discord.png',
			href: 'https://discord.gg/Rtv2xwhz7d',
			label: 'Discord',
		},
		bluesky: {
			imgUrl: origin + '/images/socials/bluesky.png',
			href: 'https://bsky.app/profile/sveltevietnam.dev',
			label: 'Bluesky',
		},
		github: {
			imgUrl: origin + '/images/socials/github.png',
			href: 'https://github.com/sveltevietnam',
			label: 'GitHub',
		},
		openCollective: {
			imgUrl: origin + '/images/socials/open-collective.png',
			href: 'https://opencollective.com/sveltevietnam',
			label: 'Open Collective',
		},
		facebook: {
			imgUrl: origin + '/images/socials/facebook.png',
			href: 'https://facebook.com/sveltevietnam',
			label: 'Facebook',
		},
		youtube: {
			imgUrl: origin + '/images/socials/youtube.png',
			href: 'https://www.youtube.com/@sveltevietnam',
			label: 'YouTube',
		},
	};
}

type Calendar = 'google' | 'microsoft' | 'yahoo';
export function createCalendars(origin: string, links: Record<Calendar, string>) {
	return {
		google: {
			imgUrl: origin + '/images/calendars/google.png',
			label: 'Google Calendar',
			href: links.google,
		},
		microsoft: {
			imgUrl: origin + '/images/calendars/microsoft.png',
			label: 'Outlook Calendar',
			href: links.microsoft,
		},
		yahoo: {
			imgUrl: origin + '/images/calendars/yahoo.png',
			label: 'Yahoo Calendar',
			href: links.yahoo,
		},
	};
}
