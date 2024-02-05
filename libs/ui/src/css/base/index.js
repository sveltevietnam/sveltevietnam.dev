import { createRequire } from '../jss-node-loader.js';

const require = createRequire(import.meta.url);

export const base = [
	require('./base.css'),
	require('./prose.css'),
	require('./max-w-pad.css'),
	require('./colors.css'),
];
