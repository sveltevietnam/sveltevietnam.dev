import { buildAllLocales } from './internals/build.js';
import { collectLocaleDirMap } from './internals/collect.js';
import { LANGUAGES } from './language.js';

/**
 * @returns {import('vite').Plugin}
 */
export function i18n() {
	const config = {
		dir: 'locales',
		langs: LANGUAGES,
		defaultLang: 'vi',
	};

	const pattern = `**/${config.dir}/{${config.langs.join(',')}}.json`;

	return {
		name: 'sveltekit-i18n',
		enforce: 'post',
		async configureServer(server) {
			const cwd = server.config.root;
			const localeDirMap = await collectLocaleDirMap(cwd, pattern);

			await buildAllLocales(localeDirMap, config.langs, config.defaultLang);
		},
	};
}
