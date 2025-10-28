import type { InferKey, Message } from '@sveltevietnam/i18n-new';

/**
 * DO NOT USE: for typing only
 * This is expected to be augmented via the generated `<output-dir>/i18n.d.ts`
 */
export interface $$Runtime {
	(): {
		/**
		 * indicate what mode we are running in, 'remote' or 'static'
		 * so that type and runtime behavior can be adjusted accordingly
		 */
		mode: 'static' | 'remote';
		mapping: Record<string, Message>;
		languages: string[];
	};
}

export type Mode = ReturnType<$$Runtime>['mode'];
export type Language = ReturnType<$$Runtime>['languages'][number];
export type Mapping = ReturnType<$$Runtime>['mapping'];
export type Key = keyof Mapping;
export type KeySimple = InferKey<Mapping, 'simple'>;
export type KeyWithParams = InferKey<Mapping, 'with-params'>;
