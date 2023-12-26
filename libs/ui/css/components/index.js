import { createRequire } from '../css-node-loader.js';

const require = createRequire(import.meta.url);

export const components = {
	// HYGEN INJECTION MARKER
	...require('./c-splash.css'),
	...require('./__wireframe__.css'),
	...require('./c-avatar.css'),
	...require('./c-btn.css'),
	...require('./c-callout.css'),
	...require('./c-input.css'),
	...require('./c-link.css'),
	...require('./c-loader.css'),
	...require('./c-logo.css'),
	...require('./c-tag.css'),
	...require('./c-tooltip.css'),
	// containers
	...require('./containers/c-card-action.css'),
	...require('./containers/c-intro.css'),
	// typography
	...require('./typography/c-text-h1.css'),
	...require('./typography/c-text-h2.css'),
	...require('./typography/c-text-h3.css'),
	...require('./typography/c-text-h4.css'),
	...require('./typography/c-text-h5.css'),
	...require('./typography/c-text-body1.css'),
	...require('./typography/c-text-body2.css'),
	...require('./typography/c-text-cap1.css'),
	...require('./typography/c-text-cap2.css'),
};
