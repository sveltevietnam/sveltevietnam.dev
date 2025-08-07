import child_process from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path/posix';
import process from 'node:process';

import * as p from '@clack/prompts';
import dedent from 'dedent';
import { normalize } from 'normalize-diacritics';
import pico from 'picocolors';

import { ids as categoryIds, loadBlogCategory } from '../src/data/blog/categories';
import { ids as seriesIds, loadBlogSeries } from '../src/data/blog/series';
import { ids as authorIds, loadPerson } from '../src/data/people';

import { validateTextField, validateNumberField, onCancel, escapeQuotes } from './helpers';

const cwd = process.cwd();

/// intro
console.log('\n');
p.intro(pico.bgCyan(pico.black(' Welcome to the Svelte Vietnam Blog ')));
p.note(dedent`
	First, let's gather some information about your post.
	For some questions, you will need to provide answers in both English and Vietnamese.
	${pico.yellow('Note: you can always change these information later.')}
`);

/// load necessary data
const [categories, series, authors] = await Promise.all([
	Promise.all(categoryIds.map((id) => loadBlogCategory(id, 'en'))),
	Promise.all(seriesIds.map((id) => loadBlogSeries(id, 'en'))),
	Promise.all(authorIds.map((id) => loadPerson(id, 'en'))),
]);

const post = await p.group(
	{
		authors: () =>
			p.multiselect({
				message: `Select at least one author (run ${pico.yellow('pnpm create:person')} to add more):`,
				options: authors.map((author) => ({
					value: author!.id,
					label: author!.name,
					hint: author!.description,
				})),
				required: true,
			}),
		originalLang: () =>
			p.select({
				message: 'Select the original language of the post:',
				options: [
					{ value: 'en', label: 'English' },
					{ value: 'vi', label: 'Tiếng Việt' },
				],
			}),
		title: () =>
			p.group(
				{
					en: () => p.text({ message: 'Enter post title (English):', validate: validateTextField }),
					vi: () =>
						p.text({ message: 'Enter post title (Tiếng Việt):', validate: validateTextField }),
				},
				{
					onCancel,
				},
			),
		desc: () =>
			p.group(
				{
					en: () =>
						p.text({ message: 'Enter short description (English):', validate: validateTextField }),
					vi: () =>
						p.text({
							message: 'Enter short description (Tiếng Việt):',
							validate: validateTextField,
						}),
				},
				{
					onCancel,
				},
			),
		keywords: () =>
			p.group(
				{
					en: () =>
						p.text({
							message: 'Enter comma-separated keywords (English), if any:',
							defaultValue: '',
						}),
					vi: () =>
						p.text({
							message: 'Enter comma-separated keywords (Tiếng Việt), if any:',
							defaultValue: '',
						}),
				},
				{
					onCancel,
				},
			),
		categories: () =>
			p.multiselect({
				message: 'Select at least one category for your post:',
				options: categories.map((cat) => ({
					value: cat!.id,
					label: cat!.name,
					hint: cat!.description,
				})),
				required: true,
			}),
		series: () =>
			p.multiselect({
				message: 'Select the series this post belongs to (if any):',
				options: series.map((s) => ({
					value: s!.id,
					label: s!.name,
					hint: s!.description,
				})),
				required: false,
			}),
		outdate: () =>
			p.text({
				defaultValue: '',
				message:
					'Enter the number of days after which this post may be considered outdated (optional):',
				validate: validateNumberField,
			}),
	},
	{
		onCancel,
	},
);

/// create artifacts
const spinner = p.spinner();
spinner.start('Creating blog post artifacts...');

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

// generate slug
const date_slug = `${year}${month}${day}`;
const slug = {
	en:
		date_slug +
		'-' +
		(await normalize(post.title.en))
			.trim()
			.replace(/[^a-zA-Z0-9]/g, '-')
			.replace(/-+/g, '-')
			.replace(/-$/g, '')
			.replace(/^-/g, '')
			.toLowerCase(),
	vi:
		date_slug +
		'-' +
		(await normalize(post.title.vi))
			.trim()
			.replace(/[^a-zA-Z0-9]/g, '-')
			.replace(/-+/g, '-')
			.replace(/-$/g, '')
			.replace(/^-/g, '')
			.toLowerCase(),
};

const dirpath = path.join(cwd, 'src/data/blog/posts', slug.en);
const content_dirpath = path.join(dirpath, 'content');
await fs.mkdir(content_dirpath, { recursive: true });
const metadata_path = path.join(dirpath, 'metadata.ts');
const content_path = {
	en: path.join(content_dirpath, 'en.md.svelte'),
	vi: path.join(content_dirpath, 'vi.md.svelte'),
};
const content_placeholder = dedent`
<blockquote>
  <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</p>
  <footer>— <cite>https://www.lipsum.com/</cite></footer>
</blockquote>

## Start with H2

  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

<div class="c-callout c-callout--success c-callout--icon-confetti">

Check out the [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) for typical markdown syntax,
or [Svelte Vietnam Blog Writing Guide](/en/blog/write) for more custom syntax.

</div>
`;
const translation = {
	en: post.originalLang === 'en' ? 'original' : 'manual',
	vi: post.originalLang === 'vi' ? 'original' : 'manual',
};

const metadata = dedent`
import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('${year}-${month}-${day}'),
	authors: [${post.authors.map((id) => `'${id}'`).join(', ')}],
	categories: [${post.categories.map((id) => `'${id}'`).join(', ')}],
	series: [${post.series.map((id) => `'${id}'`).join(', ')}],
	outdate: ${post.outdate ? Number(post.outdate.trim()) : false},
	...(
		{
			en: {
				slug: '${escapeQuotes(slug.en)}',
				title: '${escapeQuotes(post.title.en.trim())}',
				description: '${escapeQuotes(post.desc.en.trim())}',
				keywords: '${escapeQuotes(post.keywords?.en?.trim().toLowerCase()) || 'svelte, blog, sveltevietnam'}',
				translation: '${translation.en}',
				// TODO: update these information once you finish writing
				readMinutes: 0,
				numWords: 0,
			},
			vi: {
				slug: '${escapeQuotes(slug.vi)}',
				title: '${escapeQuotes(post.title.vi.trim())}',
				description: '${escapeQuotes(post.desc.vi.trim())}',
				keywords: '${escapeQuotes(post.keywords?.vi?.trim().toLowerCase()) || 'svelte, blog, sveltevietnam'}',
				translation: '${translation.vi}',
				// TODO: update these information once you finish writing
				readMinutes: 0,
				numWords: 0,
			},
		} as const
	)[lang],
}));
`;
await Promise.all([
	fs.writeFile(metadata_path, metadata, 'utf-8'),
	fs.writeFile(content_path.en, content_placeholder, 'utf-8'),
	fs.writeFile(content_path.vi, content_placeholder, 'utf-8'),
]);
child_process.execSync(
	`pnpm prettier --write --config="../../prettier.config.js" ${metadata_path}`,
	{
		cwd,
	},
);

spinner.stop('Created blog post artifacts!');
p.note(
	dedent`
Added at ${pico.green(path.relative(cwd, dirpath))}:
+ Metadata: ${pico.green(path.relative(dirpath, metadata_path))}
+ Content (en): ${pico.green(path.relative(dirpath, content_path.en))}
+ Content (vi): ${pico.green(path.relative(dirpath, content_path.vi))}
`,
	'Artifacts',
);

p.note(
	dedent`
	Start writing your post in the "content/<lang>.md.svelte" files.

	For more detailed guidelines, please refer to the documentation
	at ${pico.yellow('https://sveltevietnam.dev/en/blog/write')}.
`,
	'Next steps...',
);

p.outro(pico.green(`All set. Happy writing!`));
process.exit(0);
