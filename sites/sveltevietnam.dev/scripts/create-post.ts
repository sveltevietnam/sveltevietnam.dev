import child_process from 'child_process';
import fs from 'fs/promises';
import path from 'path/posix';

import * as p from '@clack/prompts';
import dedent from 'dedent';
import { normalize } from 'normalize-diacritics';
import pico from 'picocolors';
import * as yaml from 'yaml';

import { ids as categoryIds, loadBlogCategory } from '../src/data/blog/categories';
import { ids as seriesIds, loadBlogSeries } from '../src/data/blog/series';
import { ids as authorIds, loadPerson } from '../src/data/people';

const cwd = process.cwd();

function validateTextField(text: string): string | undefined {
	if (text.trim().length === 0) return 'This field is required.';
}

function cancel() {
	p.cancel('Operation cancelled.');
	process.exit(0);
}

/// intro
console.log('\n');
p.intro(pico.bgCyan(pico.black(' Welcome to the Svelte Vietnam Blog ')));
p.note(dedent`
	First, let's gather some information about your post.
	You will need to provide answers in both English and Vietnamese.
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
					onCancel: cancel,
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
					onCancel: cancel,
				},
			),
		keywords: () =>
			p.group(
				{
					en: () => p.text({ message: 'Enter comma-separated keywords (English), if any:' }),
					vi: () => p.text({ message: 'Enter comma-separated keywords (Tiếng Việt), if any:' }),
				},
				{
					onCancel: cancel,
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
	},
	{
		onCancel: cancel,
	},
);

/// create post artifacts
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
const locale_id = slug.en.replace(/-/g, '_');

const locales_dir_path = path.join(cwd, 'src/data/blog/locales');
const locales_path = {
	en: path.join(locales_dir_path, 'en.yaml'),
	vi: path.join(locales_dir_path, 'vi.yaml'),
};
const [locales_en, locales_vi] = await Promise.all([
	fs.readFile(locales_path.en, 'utf-8'),
	fs.readFile(locales_path.vi, 'utf-8'),
]);
const locales = {
	en: yaml.parse(locales_en),
	vi: yaml.parse(locales_vi),
};
for (const lang of ['en', 'vi'] as const) {
	locales[lang].messages.posts[locale_id] = {
		slug: slug[lang],
		title: post.title[lang].trim(),
		desc: post.desc[lang].trim(),
		keywords: post.keywords?.[lang]?.trim() || 'svelte, blog, sveltevietnam',
	};
}
await Promise.all([
	fs.writeFile(locales_path.en, yaml.stringify(locales.en), 'utf-8'),
	fs.writeFile(locales_path.vi, yaml.stringify(locales.vi), 'utf-8'),
]);

const dirpath = path.join(cwd, 'src/data/blog/posts', `${year}${month}${day}-${slug.en}`);
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
or [Svelte Vietnam Blog Writing Guide](https://sveltevietnam.dev/en/blog/write) for more custom syntax.

</div>
`;
const translation = {
	en: post.originalLang === 'en' ? 'original' : 'manual',
	vi: post.originalLang === 'vi' ? 'original' : 'manual',
};
const metadata = dedent`
import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.${locale_id}.slug'](lang),
	title: m['posts.${locale_id}.title'](lang),
	description: m['posts.${locale_id}.desc'](lang),
	keywords: m['posts.${locale_id}.keywords'](lang),
	publishedAt: new Date('${year}-${month}-${day}'),
	authors: [${post.authors.map((id) => `'${id}'`).join(', ')}],
	categories: [${post.categories.map((id) => `'${id}'`).join(', ')}],
	series: [${post.series.map((id) => `'${id}'`).join(', ')}],
	// TODO: update these information once you finish writing
	...(
		{
			en: {
				readMinutes: 0,
				numWords: 0,
				translation: '${translation.en}',
			},
			vi: {
				readMinutes: 0,
				numWords: 0,
				translation: '${translation.vi}',
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
	`pnpm prettier --write --config="../../prettier.config.js" ${metadata_path} ${locales_path.en} ${locales_path.vi}`,
	{
		cwd,
	},
);

spinner.stop('Created blog post artifacts created!');
p.note(
	dedent`
Added at ${pico.green(path.relative(cwd, dirpath))}:
+ Metadata: ${pico.green(path.relative(dirpath, metadata_path))}
+ Content (en): ${pico.green(path.relative(dirpath, content_path.en))}
+ Content (vi): ${pico.green(path.relative(dirpath, content_path.vi))}

Updated:
~ Locales (en): ${pico.yellow(path.relative(cwd, locales_path.en))}
~ Locales (vi): ${pico.yellow(path.relative(cwd, locales_path.vi))}
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

p.outro(pico.green(`All set. Have fun!`));
process.exit(0);
