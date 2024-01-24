export const en = {
	title: 'Colors',
	primitives: {
		title: 'Primitive Colors',
		colors: {
			grayscale: 'Grayscale',
			orange: 'Orange',
			green: 'Green',
			folly: 'Folly',
			amber: 'Amber',
			emerald: 'Emerald',
			blue: 'Blue',
			stone: 'Stone',
		},
	},
	semantic: {
		title: 'Semantic Colors',
		description:
			'These colors has meaning depending on the context it is used in. They also change according to the color scheme (light vs dark mode).',
		common: {
			surface: 'Surface',
			details: 'Details',
			example: 'Example',
			text: 'Text',
			element: 'Element',
		},
		brand: {
			title: 'Brand',
			colors: {
				primary: 'Primary',
				secondary: 'Secondary',
				link: 'Hyperlink',
				outline: 'Outline',
				neutral: 'Neutral',
				gradient: 'Gradient',
				foreground: 'Foreground',
				background: 'Background',
			},
		},
		status: {
			title: 'Status',
			notification:
				'This is a sample notification that expresses the status of the application / system.',
			colors: {
				info: 'Info',
				success: 'Success',
				warning: 'Warning',
				error: 'Error',
			},
		},
		others: {
			title: 'Others',
		},
	},
	developers: {
		title: 'Development',
		description:
			'Developers might find the following resources helpful to understand how the color system above is implemented.',
		links: {
			jsToken: 'Color token declarations in Javascript',
			tailwindConfig: 'TailwindCSS theme configuration that imports the color declarations above',
			cssVariables: 'CSS custom properties that build the semantic colors upon primitive ones',
		},
	},
} satisfies typeof import('./vi').vi;
