import { writeFile } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { base } from './base/index.js';
import { components } from './components/index.js';
import { utilities } from './utilities/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

writeFile(resolve(__dirname, './base/base.dist.json'), JSON.stringify(base), 'utf-8', (e) => {
	if (e) console.error(e);
});

writeFile(
	resolve(__dirname, './components/components.dist.json'),
	JSON.stringify(components),
	'utf-8',
	(e) => {
		if (e) console.error(e);
	},
);

writeFile(
	resolve(__dirname, './utilities/utilities.dist.json'),
	JSON.stringify(utilities),
	'utf-8',
	(e) => {
		if (e) console.error(e);
	},
);
