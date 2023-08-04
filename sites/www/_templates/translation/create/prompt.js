/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync } = require('fs');
const path = require('path');

const glob = require('tiny-glob/sync');

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      path: `${source}/${dirent.name}`,
      name: dirent.name,
    }));

const CONFIG = {
  page: {
    base: 'src/routes',
    getDirs() {
      const pages = glob(`${CONFIG.page.base}/**/+page.svelte`).sort();
      return pages.map((p) => {
        const dirname = path.dirname(p);
        let name = path.relative(CONFIG.page.base, dirname.replace('[[lang=lang]]', ''));
        if (name === '') name = 'home';
        const level = name.split('/').length;
        return {
          name: `${'    '.repeat(level - 1)}${name}`,
          path: path.join(dirname, '_page'),
        };
      });
    },
  },
  action: {
    base: 'src/lib/shared/actions',
    getDirs() {
      return getDirectories(CONFIG.action.base);
    },
  },
  component: {
    base: 'src/lib/client/components',
    getDirs() {
      return getDirectories(CONFIG.component.base);
    },
  },
  modal: {
    base: 'src/lib/client/modals',
    getDirs() {
      return getDirectories(CONFIG.modal.base);
    },
  },
};

// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
module.exports = {
  prompt: async ({ prompter, args }) => {
    let tPath = args.path;

    if (!tPath) {
      const { domain } = await prompter.prompt({
        type: 'select',
        name: 'domain',
        message: 'Which domain to create translation for?',
        choices: ['page', 'action', 'component', 'modal'],
        required: true,
      });
      const { getDirs } = CONFIG[domain];
      const dirs = getDirs();
      const { target } = await prompter.prompt({
        type: 'select',
        name: 'target',
        message: 'Which target to create translation for?',
        choices: dirs.map((d) => d.name),
        required: true,
      });
      const dir = dirs.find((d) => d.name === target);
      tPath = dir.path;
    }
    return { path: tPath };
  },
};
