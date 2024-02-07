const { slugify } = require('../../_utils/slugify.js');

module.exports = {
	prompt: async ({ prompter }) => {
		/** @type {{ title: string }} */
		let { title } = await prompter.prompt({
			type: 'input',
			message: 'What is the English title of your event?',
			name: 'title',
			required: true,
		});
		title = title.trim();

		/** @type {{ yearMonth: string }} */
		let { yearMonth } = await prompter.prompt({
			type: 'input',
			message: 'What is the year and month of the event (YYYY-MM)? (leave blank for current month)',
			name: 'yearMonth',
			validate(value) {
				value = value.trim();
				if (!value || /^\d{4}-\d{2}$/.test(value)) {
					return true;
				}
				return false;
			},
		});

		const date = new Date(yearMonth).toISOString();
		const titleForId = slugify(title);
		const slug = `${yearMonth}-${titleForId}`;

		return {
			event: {
				title,
				slug,
				date,
			},
			listing: {
				path: `$routes/(localized)/events/(events)/${slug}/_page/data`,
				alias: `post_${yearMonth.replace(/-/g, '_')}_${titleForId.replace(/-/g, '_')}`,
			},
			baseDir: `src/routes/(localized)/events/(events)/${slug}`,
		};
	},
};
