module.exports = {
	root: true,
	extends: ['@vnphanquang/eslint-config', 'plugin:svelte/recommended', 'prettier'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			// Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'svelte/no-at-html-tags': 'off',
	},
	globals: {
		App: 'readonly',
		__BUILD_TIMESTAMP__: 'readonly',
	},
};
