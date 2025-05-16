import imgCalendarGoogle from '$/assets/images/calendars/google.png?inline';
import imgCalendarMicrosoft from '$/assets/images/calendars/microsoft.png?inline';
import imgCalendarYahoo from '$/assets/images/calendars/yahoo.png?inline';
import imgLogo from '$/assets/images/logo.png?inline';
import imgBluesky from '$/assets/images/socials/bluesky.png?inline';
import imgDiscord from '$/assets/images/socials/discord.png?inline';
import imgFacebook from '$/assets/images/socials/facebook.png?inline';
import imgGithub from '$/assets/images/socials/github.png?inline';
import imgOpenCollective from '$/assets/images/socials/open-collective.png?inline';
import imgYoutube from '$/assets/images/socials/youtube.png?inline';

export const logoBase64Image = imgLogo;

export const socials = {
	discord: {
		base64Image: imgDiscord,
		href: 'https://discord.gg/Rtv2xwhz7d',
		label: 'Discord',
	},
	bluesky: {
		base64Image: imgBluesky,
		href: 'https://bsky.app/profile/sveltevietnam.dev',
		label: 'Bluesky',
	},
	github: {
		base64Image: imgGithub,
		href: 'https://github.com/sveltevietnam',
		label: 'GitHub',
	},
	openCollective: {
		base64Image: imgOpenCollective,
		href: 'https://opencollective.com/sveltevietnam',
		label: 'Open Collective',
	},
	facebook: {
		base64Image: imgFacebook,
		href: 'https://facebook.com/sveltevietnam',
		label: 'Facebook',
	},
	youtube: {
		base64Image: imgYoutube,
		href: 'https://www.youtube.com/@sveltevietnam',
		label: 'YouTube',
	},
};

type Calendar = 'google' | 'outlook' | 'yahoo';
export function createCalendars(links: Record<Calendar, string>) {
	return {
		google: {
			base64Image: imgCalendarGoogle,
			label: 'Google Calendar',
			href: links.google,
		},
		outlook: {
			base64Image: imgCalendarMicrosoft,
			label: 'Outlook Calendar',
			href: links.outlook,
		},
		yahoo: {
			base64Image: imgCalendarYahoo,
			label: 'Yahoo Calendar',
			href: links.yahoo,
		},
	};
}
