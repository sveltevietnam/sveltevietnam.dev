import { defineEventAdditionalStructuredData, defineEventMetadata } from '..';

const EVENT_DISCUSS_CHANNEL_LINK =
	'https://discord.com/channels/1066621936546877450/1080294419359596625';

export default defineEventMetadata((lang) => ({
	href: EVENT_DISCUSS_CHANNEL_LINK,
	people: ['quang-design', 'liti-dev', 'vnphanquang'],
	title:
		lang === 'en'
			? 'Monthly Casual Community Online Meetup'
			: 'Gặp mặt cộng động trực tuyến hàng tháng',
	description:
		lang === 'en'
			? "Join us monthly to talk all things Svelte, web development, and life in general. Exact date and time will be announced each month in Discord depending on the calendar and members' schedule. Note: this event is in Vietnamese."
			: 'Mời bạn tham gia gặp mặt hàng tháng để kết nối và chia sẻ cùng cộng đồng Svelte Việt Nam. Thời gian cụ thể sẽ được thông báo hàng tháng trên Discord theo lịch của thành viên.',
	keywords:
		lang === 'en'
			? 'monthly, online, casual, meetup, community'
			: 'hàng tháng, trực tuyến, gặp mặt, cộng đồng',
	startDate:
		lang === 'en'
			? 'Tentatively second/third Saturday, 14:00-15:00'
			: 'Thứ bảy tuần thứ hai/ba, 14:00-15:00',
	location: [
		{
			href: EVENT_DISCUSS_CHANNEL_LINK,
			name: lang === 'en' ? 'Online via Discord' : 'Trực tuyến trên Discord',
		},
	],
}));

export const structured = defineEventAdditionalStructuredData(() => ({
	eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
	location: [
		{
			'@type': 'VirtualLocation',
			name: 'Discord',
			url: EVENT_DISCUSS_CHANNEL_LINK,
		},
	],
}));
