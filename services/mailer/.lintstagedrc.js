import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.mjml': ['node scripts/lint-staged-mjml.js'],
};
