import postcssColorScheme from 'postcss-color-scheme';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomSelectors from 'postcss-custom-selectors';

/**
 * @returns {import('vite').Plugin}
 */
export function css() {
	return {
		name: 'sveltevietnam-css',
		config: () => ({
			css: {
				transformer: 'postcss',
				postcss: {
					plugins: [
						postcssCustomMedia(),
						postcssCustomSelectors(),
						postcssColorScheme({ name: 'media' }),
					],
				},
			},
		}),
	};
}
