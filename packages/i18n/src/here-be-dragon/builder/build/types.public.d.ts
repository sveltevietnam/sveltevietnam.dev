import type { MessageParameter, ParseLocaleOptions, Message } from '../../parser';

export type BuildEntry = Record<string, string>;

export interface BuildInput {
	/** absolute path to locale file per language mapping */
	entries: Record<string, string>;
	parseOptions?: ParseLocaleOptions;
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

export interface Locale {
	/** filepath to the original locale file */
	source: string;
	/** language associated with this locale, as configured in build input */
	lang: string;
	/** all messages parsed from the locale file */
	messages: Message[];
	/** JS module output from compiler */
	module: string;
}

export type BuildOutput = Locale[];
