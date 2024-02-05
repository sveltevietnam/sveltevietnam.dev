import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const core = {
	base: './core/base/index.js',
	components: './core/components/index.js',
	utilities: './core/utilities/index.js',
};

const typography = {
	base: './typography/base/index.js',
};

/**
 * @param {string} name
 * @param {string} outDir
 * @param {Record<string, string>} entries
 */
async function build(name, outDir, entries) {
	if (!existsSync(outDir)) {
		mkdirSync(outDir, {
			recursive: true,
		});
	}

	const js = (
		await Promise.all(
			Object.entries(entries).map(([name, path]) =>
				import(path)
					.then((m) => m.default)
					.then((m) => `export const ${name} = ${JSON.stringify(m)};`),
			),
		)
	).join('\n');
	writeFileSync(join(outDir, `${name}.js`), js, 'utf-8');
}

const jssOutputDir = resolve(__dirname, '../lib/css/jss');

build('core', jssOutputDir, core);
build('typography', jssOutputDir, typography);
