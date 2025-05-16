import imgCalendarGoogle from '$/assets/images/calendars/google.png';
import imgCalendarMicrosoft from '$/assets/images/calendars/microsoft.png';
import imgCalendarYahoo from '$/assets/images/calendars/yahoo.png';
import imgBluesky from '$/assets/images/socials/bluesky.png';
import imgDiscord from '$/assets/images/socials/discord.png';
import imgFacebook from '$/assets/images/socials/facebook.png';
import imgGithub from '$/assets/images/socials/github.png';
import imgOpenCollective from '$/assets/images/socials/open-collective.png';
import imgYoutube from '$/assets/images/socials/youtube.png';

export const socials = {
	discord: {
		img: imgDiscord,
		href: 'https://discord.gg/Rtv2xwhz7d',
		label: 'Discord',
	},
	bluesky: {
		img: imgBluesky,
		href: 'https://bsky.app/profile/sveltevietnam.dev',
		label: 'Bluesky',
	},
	github: {
		img: imgGithub,
		href: 'https://github.com/sveltevietnam',
		label: 'GitHub',
	},
	openCollective: {
		img: imgOpenCollective,
		href: 'https://opencollective.com/sveltevietnam',
		label: 'Open Collective',
	},
	facebook: {
		img: imgFacebook,
		href: 'https://facebook.com/sveltevietnam',
		label: 'Facebook',
	},
	youtube: {
		img: imgYoutube,
		href: 'https://www.youtube.com/@sveltevietnam',
		label: 'YouTube',
	},
};

export const calendars = {
	google: {
		img: imgCalendarGoogle,
		label: 'Google Calendar',
	},
	outlook: {
		img: imgCalendarMicrosoft,
		label: 'Outlook Calendar',
	},
	yahoo: {
		img: imgCalendarYahoo,
		label: 'Yahoo Calendar',
	},
};
type Calendar = keyof typeof calendars;
export function createCalendarLinks(links: Record<Calendar, string>) {
	return [
		{
			...calendars.google,
			href: links.google,
		},
		{
			...calendars.outlook,
			href: links.outlook,
		},
		{
			...calendars.yahoo,
			href: links.yahoo,
		},
	];
}
