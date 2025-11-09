import os from 'node:os';
import path from 'node:path';

import { type SourceMessage, parseMessageParams } from '../src/parser';

export function createSourceMessage(key: string, content: string): SourceMessage {
	const params = parseMessageParams(content);
	return { key, content, params, sources: [{ content, file: 'generated-from-test' }] };
}

export function crosspath(p: string): string {
	if (os.platform() !== 'win32') return p;
	p = path.win32.resolve(p).replaceAll('\n', '\\n');
	return p;
}
