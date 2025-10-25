import type { Message } from '../../runtime';

export type MessageTargetMap<
	MessageMap extends Record<string, Message>,
	Key extends keyof MessageMap,
> = Record<
	Key,
	MessageMap[Key]['$t'] extends 'with-params'
		? (params: MessageMap[Key]['$$p']) => string
		: () => string
>;
