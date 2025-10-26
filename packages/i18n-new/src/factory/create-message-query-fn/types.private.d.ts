import type { InferType, InferParams, Message } from '../../runtime/types.public';

export type MessageTargetMap<
	Mapping extends Record<string, Message>,
	Key extends keyof Mapping,
> = Record<
	Key,
	InferType<Mapping[Key]> extends 'with-params'
		? (params: InferParams<Mapping[Key]>) => string
		: () => string
>;
