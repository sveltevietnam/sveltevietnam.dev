import { existsSync, mkdirSync, writeFile } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { base } from './base/index.js';
import { components } from './components/index.js';
import { utilities } from './utilities/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const jssOutputDir = resolve(__dirname, '../lib/css/jss');

if (!existsSync(jssOutputDir)) {
	mkdirSync(jssOutputDir);
}

writeFile(join(jssOutputDir, './base.jss.json'), JSON.stringify(base), 'utf-8', (e) => {
	if (e) console.error(e);
});

writeFile(join(jssOutputDir, './components.jss.json'), JSON.stringify(components), 'utf-8', (e) => {
	if (e) console.error(e);
});

writeFile(join(jssOutputDir, './utilities.jss.json'), JSON.stringify(utilities), 'utf-8', (e) => {
	if (e) console.error(e);
});
