import { definePerson, definePersonLinks } from '..';

import ogImageEn from './og.en.jpg?url';
import ogImageVi from './og.vi.jpg?url';

export const en = definePerson({
	name: 'Quang Phan',
	description: 'Developer, admin of Svelte Vietnam',
	ogImage: ogImageEn,
});

export const vi = definePerson({
	name: 'Phan Quang',
	description: 'Lập trình viên, quản trị viên Svelte Việt Nam',
	ogImage: ogImageVi,
});

export const links = definePersonLinks({
	website: 'https://vnphanquang.com',
	bluesky: 'https://bsky.app/profile/vnphanquang.com',
	github: 'https://github.com/vnphanquang',
});
