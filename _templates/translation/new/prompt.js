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
        .toLowerCase()
        // replace non letter/numbers with a hyphen
        .replace(/[^a-zA-Z0-9]/g, '-');
    }

    let domain = args.domain;
    if (!domain) {
      ({ domain } = await prompter.prompt({
        type: 'select',
        name: 'domain',
        message: 'Pick a domain:',
        choices: ['page', 'default'],
        required: true,
      }));
      switch (domain) {
        case 'page':
          domain = 'pages/';
          break;
        case 'default':
        default:
      }
    }

    return { name, domain };
  },
};
