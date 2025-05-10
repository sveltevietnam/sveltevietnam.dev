import child_process from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path/posix';
import process from 'node:process';

import * as p from '@clack/prompts';
import dedent from 'dedent';
import pico from 'picocolors';

import { ids } from '../src/data/people';

import {
	validateTextField,
	validateIdField,
	validateUrlField,
	onCancel,
	escapeQuotes,
} from './helpers';

const LINK_PLACEHOLDER = {
	website: 'https://example.com',
	bluesky: 'https://bsky.app/profile/example.com',
	twitter: 'https://twitter.com/example',
	linkedin: 'https://linkedin.com/in/example',
};

/// intro
console.log('\n');
p.intro(pico.bgCyan(pico.black(' Welcome to Svelte Vietnam ')));
p.note(dedent`
First, let's gather some information about the person.
	For some questions, you will need to provide answers in both English and Vietnamese.
	${pico.yellow('Note: you can always change these information later.')}
`);

const person = await p.group(
	{
		id: () =>
			p.text({
				message: `Enter person's Github username, as in github.com/${pico.yellow('<username>')}:`,
				validate: (id) => validateIdField(ids, id),
			}),
		name: () =>
			p.group(
				{
					en: () =>
						p.text({
							message: "Enter person's name (English):",
							placeholder: 'e.g Phương Phạm',
							validate: validateTextField,
						}),
					vi: () =>
						p.text({
							message: "Enter person's name (Tiếng Việt):",
							placeholder: 'e.g Phạm Phương',
							validate: validateTextField,
						}),
				},
				{
					onCancel,
				},
			),
		desc: () =>
			p.group(
				{
					en: () =>
						p.text({
							message: "Enter person's short description (English):",
							placeholder: 'e.g. Designer at Company XYZ',
							validate: validateTextField,
						}),
					vi: () =>
						p.text({
							message: "Enter person's short description (Tiếng Việt):",
							placeholder: 'e.g. Thiết kế viên tại Công ty XYZ',
							validate: validateTextField,
						}),
				},
				{
					onCancel,
				},
			),
		pickedLinks: () =>
			p.multiselect({
				message: "Select links you'd like to add for this person:",
				options: [
					{ value: 'website', label: 'Website' },
					{ value: 'bluesky', label: 'Bluesky' },
					{ value: 'twitter', label: 'Twitter/X' },
					{ value: 'linkedin', label: 'LinkedIn' },
				],
			}),
		links: ({ results }) => {
			if (!results.pickedLinks?.length) {
				return undefined;
			}
			return p.group(
				results.pickedLinks.reduce(
					(acc, link) => {
						acc[link] = () =>
							p.text({
								message: `Enter ${pico.yellow(link)} link:`,
								placeholder: `e.g. ${LINK_PLACEHOLDER[link]}`,
								validate: validateUrlField,
							});
						return acc;
					},
					{} as Record<(typeof results.pickedLinks)[number], () => Promise<string | symbol>>,
				),
				{
					onCancel,
				},
			);
		},
	},
	{
		onCancel,
	},
);

/// create artifacts
const spinner = p.spinner();
spinner.start('Creating person artifacts...');

const cwd = process.cwd();
const dirpath = path.join(cwd, 'src/data/people', person.id.trim());
const index_path = path.join(dirpath, 'index.ts');
await fs.mkdir(dirpath, { recursive: true });
const index = dedent`
import { definePerson } from '..';

export default definePerson((lang) => ({
	links: {
		github: 'https://github.com/${person.id.trim()}',
		${Object.entries(person.links ?? {}).reduce((acc, [key, value]) => {
			if (value === undefined) return acc;
			return `${acc}${key}: '${value}',\n`;
		}, '')}
	},
	...{
		en: {
			name: '${escapeQuotes(person.name.en.trim())}',
			description: '${escapeQuotes(person.desc.en.trim())}',
		},
		vi: {
			name: '${escapeQuotes(person.name.vi.trim())}',
			description: '${escapeQuotes(person.desc.vi.trim())}',
		},
	}[lang],
}));
`;
await fs.writeFile(index_path, index, 'utf-8');
child_process.execSync(`pnpm prettier --write --config="../../prettier.config.js" ${index_path}`, {
	cwd,
});

spinner.stop('Created person artifacts!');
p.note(
	dedent`
Added at ${pico.green(path.relative(cwd, index_path))}:
`,
	'Artifacts',
);

p.outro(pico.green(`All set. Thank you!`));
process.exit(0);
