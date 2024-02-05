# @sveltevietnam/ui

<img src="https://raw.githubusercontent.com/sveltevietnam/branding/main/sveltevietnam-logo.png" align="left" width="192" height="192"/>
<img align="left" width="0" height="192" hspace="2" vspace="2" />

<br />
<br />

[![npm.badge]][npm.link] [![MIT][license.badge]][license] [![Discord][socials.discord.badge]][socials.discord]

A design system for [the Svelte Vietnam project](https://github.com/sveltevietnam/sveltevietnam.dev), packaged as [Tailwind presets](https://tailwindcss.com/docs/presets).

<br />
<br />
<br />

## Installation

Install the necessary packages using your package manger of choice:

```bash
pnpm add -D tailwindcss postcss svelte @sveltevietnam/ui
```

Re-export the predefined Postcss config:

```javascript
// postcss.config.js
import config from '@sveltevietnam/ui/css/postcss';

export default config;
```

Add the preset to your `tailwind.config.js`:

```javascript
// tailwind.config.js
import sveltevietnam from '@sveltevietnam/ui/css/tailwind';

/** @type {import("tailwindcss").Config } */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
	presets: [...sveltevietnam],
};
```

In your entry CSS, import `fonts.css`:

```css
/* app.css */
@import url('@sveltevietnam/ui/css/fonts.css');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Editor Support

It is recommended, if possible, that you install the appropriate editor plugin/extension that adds support for TailwindCSS Language Server. If you are using VSCode, install the official [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss). This greatly improves code discovery and developer productivity.

## Documentation

...Coming soon...

[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE
[npm.badge]: https://img.shields.io/npm/v/@sveltevietnam/ui
[npm.link]: https://www.npmjs.com/package/@sveltevietnam/ui
[socials.discord.badge]: https://img.shields.io/discord/1066621936546877450?color=7289da&label=Discord&logo=discord
[socials.discord]: https://discord.sveltevietnam.dev
