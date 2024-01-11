export const en = {
	title: 'Blog',
	typography: {
		title: 'Typography',
		description:
			'\
			Typography sizing and spacing for blog posts of Svelte Vietnam is set up based on \
			the default configuration of <a class="c-link" \
			href="https://tailwindcss.com/docs/typography-plugin" target="_blank" rel="noreferrer">@tailwincss/typography</a>, \
			inside elements with the "prose" class. Small customizations are added to ensure consistency \
			with the overall design of <em>sveltevietnam.dev</em>. You can inspect these customization at \
			<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/tailwind.config.js" target="_blank" rel="noreferrer">tailwind.config.js</a>.\
			',
	},
	codeblock: {
		title: 'Rendering Source Code',
		description:
			'\
			Technical blog posts often contain code blocks as examples. Svelte Vietnam uses \
			<a class="c-link" href="https://github.com/antfu/shikiji" target="_blank" rel="noreferrer">shikiji</a> \
			to provide syntax highlighting. To render a code block, use the same syntax as in markdown\
		',
		language: 'Language',
		sourceCode: 'Source code',
		example: 'For example, using the svelte language will produce the following result:',
		supportedLanguages:
			'\
		Currently, the supported languages are svelte, javascript, typescript, and shellscript. \
		If you need to add more language, inspect the "shikiji" configuration at \
		<a class="c-link" href="https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/mdsvex.config.js#L24" target="_blank" rel="noreferrer">mdsvex.config.js</a>.\
		',
		diff: {
			description:
				'To visualize code change, you can wrap the lines in comment with the directive `:::diff +` or `:::diff -`. For example, the following markdown...',
			example: '...will render as',
		},
		highlight: {
			description:
				'Similarly, for highlighting text, you can wrap the lines in comment with the directive `:::highlight`. For example, the following markdown...',
			example: '...will render as',
		},
	},
	components: {
		title: 'Common Components',
		description:
			'\
		Patterns of markup structure and styling will emerge from the process of writing. \
		These are opportunities to extract reusable components for writers to utilize in later blog posts.\
		',
		callout: {
			title: 'Callout',
			description:
				'\
				These are details put inside highlighted boxes that express additional context to support the current document, \
				for when you want to capture readers attention to important messages or instructions. \
				To use, you need to add to your HTML element the class `c-callout` together with one of the following modifiers: \
				`c-callout--info`, `c-callout--success`, `c-callout--warning`, `c-callout-error`.\
				',
			examples: {
				info: 'Use `c-callout-info` to express a generic notification or instruction',
				success: 'Use `c-callout-success` to express a completion, or encouragement',
				warning: 'Use `c-callout-warning` to express, unsurprisingly, a warning',
				error: 'Use `c-callout-error` to express a bad scenario, an error, or discouragement',
			},
			container:
				'\
			When writing blog posts with the extended markdown syntax from Svelte Vietnam, \
			you can wrap a section in callout using the ":::" container syntax made possible by \
			the <a class="c-link" href="https://github.com/Nevenall/remark-containers" target="_blank" rel="noreferrer">remark-container</a> library.\
			',
		},
	},
} satisfies typeof import('./vi').vi;
