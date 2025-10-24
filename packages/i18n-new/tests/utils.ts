import { type SourceMessage, parseMessageParams } from '../src/parser';

export function createSourceMessage(key: string, content: string): SourceMessage {
	const params = parseMessageParams(content);
	return { key, content, params, sources: [{ content, file: 'generated-from-test' }] };
}
