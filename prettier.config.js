/** @type {import('prettier').Config} */
export default {
	semi: true,
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [
		{ files: '**/*.svelte', options: { parser: 'svelte' } },
		{
			files: '**/*.yaml',
			options: {
				proseWrap: 'always',
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
