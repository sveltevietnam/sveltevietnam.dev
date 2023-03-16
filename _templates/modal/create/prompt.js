// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
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

    return { name };
  },
};
