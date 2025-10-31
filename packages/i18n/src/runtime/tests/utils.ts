import { vi } from 'vitest';

import { createMessageSimple, createMessageWithParams } from '../../factory';

export function createMinimalMessageSet() {
	const messageSimple = createMessageSimple('hello', {
		en: () => 'Hello',
		vi: () => 'Xin chào',
	});
	const messageWithParams = createMessageWithParams('greet', {
		en: (params: { name: string }) => `Hello, ${params.name}!`,
		vi: (params: { name: string }) => `Xin chào, ${params.name}!`,
	});
	return {
		simple: messageSimple,
		withParams: messageWithParams,
	};
}

export function mockRemoteT() {
	const { simple, withParams } = createMinimalMessageSet();
	return vi
		.fn()
		.mockImplementation(
			({
				lang,
				key,
				params,
			}: {
				lang: 'en' | 'vi';
				key: string;
				params?: Record<string, string>;
			}) => {
				if (key === simple.$k) {
					return simple(lang);
				}
				if (key === withParams.$k) {
					return withParams(lang, params ?? {});
				}
				// FIXME: what would happen here?
			},
		);
}
