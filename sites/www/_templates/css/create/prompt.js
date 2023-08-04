// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
module.exports = {
  prompt: async ({ prompter, args }) => {
    let { category, name } = args;
    if (!category) {
      ({ category } = await prompter.prompt({
        type: 'select',
        name: 'category',
        message: 'Which category of css to create?',
        choices: ['component'],
      }));
    }
    if (!name) {
      ({ name } = await prompter.prompt({
        type: 'input',
        name: 'name',
        message: 'Give it a name:',
        required: true,
      }));
      name = name.trim();
    }

    return {
      name,
      category,
      nameInCamelCase: name
        // replace non letter/numbers with a hyphen
        .replace(/[^a-zA-Z0-9]/g, '-')
        // convert to camelCase
        .replace(/-(.)/g, function ($1) {
          return $1.toUpperCase();
        })
        .replace(/-/g, ''),
    };
  },
};
