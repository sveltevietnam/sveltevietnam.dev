import type { InferParams } from '@sveltevietnam/i18n';
import type {
	Language,
	Mapping,
	Key,
	KeySimple,
	KeyWithParams,
} from '@sveltevietnam/i18n/generated';

export function query<K extends KeySimple>(input: { key: K; lang: Language }): Promise<string>;
export function query<K extends KeyWithParams>(input: {
	key: K;
	params: InferParams<Extract<Mapping[Key], { $k: K }>>;
	lang: Language;
}): Promise<string>;
