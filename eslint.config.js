import { fileURLToPath } from 'node:url';

import { defineConfig as defineVnphanquangConfig } from '@vnphanquang/eslint-config';
import { defineConfig as defineEslintConfig, globalIgnores } from 'eslint/config';
import jsdoc from 'eslint-plugin-jsdoc';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

const jsdocConfig = [
	{
		files: ['libs/**/*.js'],
		...jsdoc.configs['flat/recommended-typescript-flavor'],
	},
	{
		files: ['**/*.js'],
		plugins: {
			jsdoc,
		},
		rules: {
			'jsdoc/require-returns-description': 'off',
			'jsdoc/require-param-description': 'off',
			'jsdoc/require-jsdoc': [
				'warn',
				{
					publicOnly: {
						ancestorsOnly: true,
					},
				},
			],
		},
	},
];

/**
 * @param {import('@sveltejs/kit').Config | true} [svelteConfig]
 * @param {import('eslint').Linter.Config[]} [additionals]
 * @returns {Promise<import('eslint').Linter.Config>}
 */
export async function defineConfig(svelteConfig, additionals = []) {
	return defineEslintConfig([
		globalIgnores(['**/*.md.svelte', '**/generated/*.js']),
		...jsdocConfig,
		...(await defineVnphanquangConfig({
			gitignorePath,
			...(svelteConfig
				? { svelte: typeof svelteConfig === 'boolean' ? true : { config: svelteConfig } }
				: {}),
		})),
		...additionals,
	]);
}

export default defineConfig(true);
