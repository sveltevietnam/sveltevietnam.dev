import { createRequire } from '../css-node-loader.js';

const require = createRequire(import.meta.url);

export const utilities = {
	...require('./utilities.css'),
};
