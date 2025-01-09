import { definePerson, definePersonLinks } from '..';

export const en = definePerson({
	name: 'Quang Phan',
	description: 'Developer, admin of Svelte Vietnam',
});

export const vi = definePerson({
	name: 'Phan Quang',
	description: 'Lập trình viên, quản trị viên Svelte Việt Nam',
});

export const links = definePersonLinks({
	website: 'https://vnphanquang.com',
	bluesky: 'https://bsky.app/profile/vnphanquang.com',
	github: 'https://github.com/vnphanquang',
})
