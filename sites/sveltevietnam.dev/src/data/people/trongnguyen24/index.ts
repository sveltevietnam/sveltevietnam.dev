import { definePerson, definePersonLinks } from '..';

export const en = definePerson({
	name: 'Nguyen Le',
	description: 'UI/UX designer',
});

export const vi = definePerson({
	name: 'Lê Nguyên',
	description: 'Thiết kế viên UI/UX',
});

export const links = definePersonLinks({
	website: 'https://nguyenle.pages.dev',
});
