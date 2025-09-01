import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { createJobPostingUpsertSchema } from '$lib/forms/job-posting-upsert';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang, id } = params;
	const schema = createJobPostingUpsertSchema(lang);

	// TODO: get this form DB of current user
	const posting = {
		id,
		title: 'Senior Frontend Developer (Svelte+SvelteKit)',
		type: 'full-time' as const,
		location: 'Hà Nội, Đà Nẵng, Hồ Chí Mình (Remote/Hybrid)',
		salary: 'Up to $3000/month',
		applicationMethod: 'url' as const,
		applicationLink: 'https://sveltevietnam.dev',
		postedAt: new Date(),
		expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		employer: {
			name: 'Company XYZ ABC',
			avatarUrl: undefined,
			website: 'https://company.xyz',
		},
		href: p['/:lang/postings/:id']({ lang, id }),
		description: `
Lorem Ipsum
"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
"There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."
What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Why do we use it?

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

Where does it come from?

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
`,
	};
	return {
		posting,
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/postings/:id']({ lang, id: [id, posting.title] }),
			paths: {
				vi: p['/:lang/postings/:id']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id']({ lang: 'en', id }),
			},
		},
	};
};

export const actions: Actions = {
	delete: async () => {
		console.log('TODO: delete...');
	},
};
