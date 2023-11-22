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
			neutral: 'Neutral',
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
} satisfies typeof import('./vi').vi;
