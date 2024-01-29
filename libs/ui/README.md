# @sveltevietnam/ui

The Svelte Vietnam Design System, packaged as [Tailwind presets](https://tailwindcss.com/docs/presets).

> [!IMPORTANT]
> The `@sveltevietnam/ui` is currently currently private for internal use but soon will be published as a standalone npm package.

## Installation

Install the necessary packages using your package manger of choice:

```bash
pnpm add -D tailwindcss postcss @sveltevietnam/ui
```

Re-export the predefined Postcss config:

```javascript
// postcss.config.js
import config from '@sveltevietnam/ui/css/postcss.config.js';

export default config;
```

Add the preset to your `tailwind.config.js`:

```javascript
// tailwind.config.js
import sveltevietnam from '@sveltevietnam/ui/css/tailwind.js';

/** @type {import("tailwindcss").Config } */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}', 'svelte.config.js'],
	presets: [...sveltevietnam],
};
```

In your entry CSS, import `fonts.css`:

```css
/* app.css */
@import url('@sveltevietnam/ui/fonts/fonts.css');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Editor Support

It is recommended, if possible, that you install the appropriate editor plugin/extension that adds support for TailwindCSS Language Server. If you are using VSCode, install the official [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss). This greatly improves code discovery and developer productivity.
