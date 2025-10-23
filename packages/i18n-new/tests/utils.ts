import { type Message, parseMessage } from '../src/here-be-dragon/parser';

export function createMessage(key: string, content: string): Message {
	const params = parseMessage(content);
	const type = params.length > 0 ? 'with-params' : 'simple';
	return { type, key, content, params };
}
