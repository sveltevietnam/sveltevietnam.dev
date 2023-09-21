import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.template.mjml': ['node scripts/lint-staged-mjml.js'],
};
