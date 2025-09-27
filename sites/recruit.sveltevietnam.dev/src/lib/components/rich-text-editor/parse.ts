import type { OutputData } from '@editorjs/editorjs';
import EditorJSParser from 'editorjs-html';

import { parseCalloutToHtml } from './callout';

export function parse(json?: string | null): string {
	let html = '';
	if (!json) return html;

	try {
		const data = JSON.parse(json) as OutputData;
		if (!data.blocks.length) return html;
		const parser = EditorJSParser(
			{
				delimiter: () => `<p class="text-center text-3xl tracking-widest">🞵🞵🞵</p>`,
				callout: parseCalloutToHtml,
			},
			{ strict: true },
		);
		html = parser.parse(data);
	} catch (e) {
		// TODO: Error logging
		console.error('Failed to parse job description', e);
	}
	return html;
}
