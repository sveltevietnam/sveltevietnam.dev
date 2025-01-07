export const CATEGORIES = [
	{
		name: 'Insider',
		slug: 'insider',
	},
	{
		name: 'Technical',
		slug: 'technical',
	},
	{
		name: 'Ecosystem',
		slug: 'ecosystem',
	},
	{
		name: 'Svelte & Kit',
		slug: 'svelte-and-kit',
	},
] as const;

export const POST = {
	slug: 'blog-post-slug',
	title: 'Blog post title goes here, it can be short, but it can also be quite long',
	description:
		"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy  text ever since the 1500s...",
	author: 'Author Name',
	publishedAt: new Date(),
	series: [
		{
			name: 'Styling Svelte Vietnam',
			slug: 'styling-svelte-vietnam',
		},
		{
			name: 'Behind the Screen',
			slug: 'behind-the-screen',
		},
	],
	categories: CATEGORIES,
}

