import { definePerson, definePersonLinks } from '..';

import ogImageEn from './og.en.jpg?url';
import ogImageVi from './og.vi.jpg?url';

export const en = definePerson({
	name: 'Nguyên Lê',
	description: 'UI/UX designer — Member of Svelte Vietnam community',
	ogImage: ogImageEn,
});

export const vi = definePerson({
	name: 'Lê Nguyên',
	description: 'Thiết kế viên UI/UX — Thành viên cộng đồng Svelte Việt Nam',
	ogImage: ogImageVi,
});

export const links = definePersonLinks({
	website: 'https://nguyenle.pages.dev',
});
