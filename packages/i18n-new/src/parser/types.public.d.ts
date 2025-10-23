import type { MessageType } from '../runtime';

import type { MessageParameter } from './parse-message/index';

export interface Message {
	type: MessageType;
	key: string;
	content: string;
	params: MessageParameter[];
}
