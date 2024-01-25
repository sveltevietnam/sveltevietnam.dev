async function promptLanguages(prompter) {
	const { languageMap } = await prompter.prompt({
		type: 'multiselect',
		name: 'languageMap',
		message: 'What languages does your post provide? (choose all that apply)',
		hint: '(Use <space> to select, <return> to submit)',
		required: true,
		choices: [
			{ name: 'Vietnamese', value: 'vi' },
			{ name: 'English', value: 'en' },
		],
		indicator(state, choice) {
			if (choice.enabled) {
				return state.symbols.radio.on;
			}
			return state.symbols.radio.off;
		},
		result(names) {
			const map = this.map(names);
			return {
				vi: !!map['Vietnamese'],
				en: !!map['English'],
			};
		},
	});

	if (languageMap.vi || languageMap.en) return languageMap;
	return promptLanguages(prompter);
}

module.exports = {
	prompt: async ({ prompter }) => {
		const languageMap = await promptLanguages(prompter);

		let selectedLangs = Object.entries(languageMap)
			.filter(([_, selected]) => selected)
			.map(([lang]) => lang);
		let originalLang = selectedLangs[0];
		if (selectedLangs.length > 1) {
			({ originalLang } = await prompter.prompt({
				type: 'select',
				message: 'What is the original language of your post?',
				name: 'originalLang',
				required: true,
				choices: [
					{ name: 'Vietnamese', value: 'vi' },
					{ name: 'English', value: 'en' },
				],
				result(name) {
					return this.map(name)[name];
				},
			}));
		}

		/** @type {{ title: string }} */
		let { title } = await prompter.prompt({
			type: 'input',
			message: 'What is the English title of your post?',
			name: 'title',
			required: true,
		});
		title = title.trim();

		let { authorName } = await prompter.prompt({
			type: 'input',
			message: 'What is the author name?',
			name: 'authorName',
			required: true,
		});
		authorName = authorName.trim();

		/** @type {{ title: string }} */
		let { dateStr } = await prompter.prompt({
			type: 'input',
			message: 'What is the publication date (YYYY-MM-DD)? (leave blank for current date)',
			name: 'dateStr',
			validate(value) {
				value = value.trim();
				if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
					return true;
				}
				return false;
			},
		});

		const date = dateStr ? new Date(dateStr) : new Date();
		const fullYear = date.getFullYear().toString();
		const month = (date.getMonth() + 1).toString().padStart(2, 0);
		const day = date.getDate().toString().padStart(2, 0);
		const shortDateStr = `${fullYear}${month}${day}`;

		const titleForId = slugify(title);
		const slug = `${shortDateStr}-${titleForId}`;

		return {
			languageMap,
			post: {
				originalLang,
				slug,
				date: date.toISOString(),
				title,
				author: {
					name: authorName,
				},
			},
			listing: {
				path: `$routes/(localized)/blog/(posts)/${slug}/_page/data`,
				alias: `post_${shortDateStr}_${titleForId.replace(/-/g, '_')}`,
			},
			baseDir: `src/routes/(localized)/blog/(posts)/${slug}`,
		};
	},
};

/**
 * Slugify a string
 *
 * @public
 *
 * @param {string} text - text to slugify
 * @returns {string}
 */
function slugify(text) {
	if (!text) return text;
	return text
		.trim()
		.toLowerCase()
		.replace(/[''"]+/gi, '')
		.replace(/[^a-z0-9\-_]+/gi, '-')
		.replace(/-+$/, '')
		.replace(/^-+/, '')
		.replace(/-+/g, '-');
}
