export interface MessageParameter {
	name: string;
	start: number;
	end: number;
}

export type Locale = import('valibot').InferInput<typeof import('./parse.js').LocaleSchema>;

export type LocaleDirectoryMap = Map<string, Record<string, string>>;

export interface BuildOutput {
	dirpaths: string[];
	modules: {
		filepath: string;
		code: string;
	}[];
}
