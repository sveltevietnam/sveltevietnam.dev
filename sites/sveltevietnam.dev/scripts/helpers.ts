import { cancel } from '@clack/prompts';

export function validateTextField(text: string): string | undefined {
	text = text.trim();
	if (text.length === 0) return 'This field is required.';
}

export function validateIdField(ids: string[], id: string): string | undefined {
	id = id.trim().toLowerCase();
	if (id.trim().length === 0) return 'This field is required.';
	if (ids.includes(id)) {
		return 'This person is already in the system.';
	}
}

export function validateUrlField(url: string): string | undefined {
	url = url.trim();
	if (url.length === 0) return 'This field is required.';
	try {
		new URL(url);
	} catch {
		return 'The input URL is invalid.';
	}
}

export function onCancel() {
	cancel('Operation cancelled.');
	process.exit(0);
}

export function escapeQuotes(str: string): string {
	return str.replace(/'/g, "\\'");
}

export function normalizeDiacritics(str: string): string {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

