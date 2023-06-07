module.exports = {
  root: true,
  extends: ['@vnphanquang/eslint-config', 'plugin:svelte/recommended'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['src/routes/+layout.svelte'],
      rules: {
        '@typescript-eslint/semi': 'off',
      },
    },
    // ...
  ],
  rules: {
    'svelte/no-at-html-tags': 'off',
  },
  globals: {
    App: 'readonly',
    gtag: 'readonly',
    __BUILD_TIMESTAMP__: 'readonly',
    __BUILD_HASH__: 'readonly',
    __BUILD_VERSION__: 'readonly',
  },
};
