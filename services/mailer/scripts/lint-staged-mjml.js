import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mjmlPath = resolve(process.cwd(), process.argv.slice(2)[0]);
const htmlPath = mjmlPath.replace('.mjml', '');
const mjmlConfigPath = resolve(__dirname, '../.mjmlconfig');

execSync(
  `pnpm mjml ${mjmlPath} -o ${htmlPath} --config.mjmlConfigPath ${mjmlConfigPath} --config.minify=true --config.beautify=false`,
);

// add to git
execSync(`git add ${htmlPath}`);
