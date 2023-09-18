import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import mjml2html from 'mjml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// read mjml file
const mjmlPath = resolve(process.cwd(), process.argv.slice(2)[0]);
const mjmlStr = readFileSync(mjmlPath, 'utf8');

// parse
const parsed = mjml2html(mjmlStr, {
  filePath: mjmlPath,
  mjmlConfigPath: resolve(__dirname, '../.mjmlconfig'),
});

// write html file
const htmlPath = mjmlPath.replace('.mjml', '.html');
writeFileSync(htmlPath, parsed.html, 'utf8');

// add to git
execSync(`git add ${htmlPath}`);
