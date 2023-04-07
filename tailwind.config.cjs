const sveltevietnam = require('./src/lib/client/styles/postcss/tailwind.cjs');

/** @type {import("tailwindcss").Config } */
const config = {
  darkMode: '',
  content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
  plugins: [
    require('@tailwindash/triangle'),
    sveltevietnam,
    require('postcss-color-scheme/lib/tailwind'),
  ],
};

module.exports = config;
