async function promptLanguages(prompter) {
  const { languages } = await prompter.prompt({
    type: 'multiselect',
    name: 'languages',
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

  if (languages.vi || languages.en) return languages;
  return promptLanguages(prompter);
}

module.exports = {
  prompt: async ({ prompter }) => {
    const languages = await promptLanguages(prompter);
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

    const date = new Date();
    const fullYear = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, 0);
    const day = date.getDate().toString().padStart(2, 0);
    const shortDateStr = `${fullYear}${month}${day}`;

    const titleForId = slugify(title);
    const slug = `${shortDateStr}-${titleForId}`;

    return {
      languages,
      post: {
        slug,
        date: date.toISOString(),
        title,
        author: {
          name: authorName,
        },
      },
      listing: {
        path: `../(posts)/${slug}/_page/data`,
        alias: `post_${shortDateStr}_${titleForId.replace(/-/g, '_')}`,
      },
      baseDir: `src/routes/[[lang=lang]]/blog/(posts)/${slug}`,
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
