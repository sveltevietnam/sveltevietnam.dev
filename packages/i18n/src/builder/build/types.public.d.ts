import type { MessageParameter, ParseLocaleOptions } from '../../parser';

export type BuildEntry = Record<string, string>;

export type BuildMode = 'static' | 'remote';

export interface BuildInput {
	/** absolute path to locale file per language mapping */
	entries: Record<string, string>;
	parseOptions?: ParseLocaleOptions;
	/** @default 'remote' */
	mode?: BuildMode;
}

export interface InconsistentKeyIssue {
	key: string;
	in: string;
	notIn: string;
}

export interface InconsistentParamIssue {
	key: string;
	in: { file: string; params: MessageParameter[] }[];
}

export type BuildOutput = {
	modules: {
		/** `@sveltevietnam/i18n/generated/messages` */
		messages: {
			/** [lang].js */
			targets: Record<string, string>;
			/** index.js */
			index: string;
		};
		/** `@sveltevietnam/i18n/generated/constants` */
		constants: string;
		/** `@sveltevietnam/i18n/generated/i18n.d.ts` */
		dts: string;
		/** `@sveltevietnam/i18n/generated/t.remote`, empty in 'static' mode, only populated in 'remote' mode */
		remote: string;
	};
	/** all the source locale files that were read during process */
	sources: string[];
	/** total number of collected messages */
	numMessages: number;
};
