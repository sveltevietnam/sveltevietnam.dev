// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Give it a name:',
    required: true,
  },
  {
    type: 'select',
    name: 'category',
    message: 'Pick a category:',
    choices: ['atom', 'molecule', 'organism'],
    required: true,
  },
];
module.exports = {
  prompt: async ({ prompter, args }) => {
    let name = args.name;
    if (!name) {
      ({ name } = await prompter.prompt({
        type: 'input',
        name: 'name',
        message: 'Give it a name:',
        required: true,
      }));
      name = name
        // replace non letter/numbers with a hyphen
        .replace(/[^a-zA-Z0-9]/g, '-')
        // convert to camelCase
        .replace(/-(.)/g, function ($1) {
          return $1.toUpperCase();
        })
        .replace(/-/g, '');
    }

    let category = args.category;
    if (!category) {
      ({ category } = await prompter.prompt({
        type: 'select',
        name: 'category',
        message: 'Pick a category:',
        choices: ['atom', 'molecule', 'organism'],
        required: true,
      }));
    }

    return { name, category };
  },
};
