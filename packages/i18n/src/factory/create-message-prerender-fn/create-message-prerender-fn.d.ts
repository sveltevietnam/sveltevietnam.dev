import type { Message } from '../../runtime/types.public';
import type { MessageQueryInput } from '../create-message-query-fn';

export function createMessagePrerenderFn<
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n/generated').Mapping,
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
>(
	modules: Record<string, () => Promise<unknown>>,
): <Key extends keyof Mapping>(input: MessageQueryInput<Mapping, Language, Key>) => Promise<string>;

export type MessagePrerenderFn<
	Mapping extends Record<string, Message> = import('@sveltevietnam/i18n/generated').Mapping,
	Language extends string = import('@sveltevietnam/i18n/generated').Language,
> = ReturnType<typeof createMessagePrerenderFn<Mapping, Language>>;
