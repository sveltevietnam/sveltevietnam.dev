export interface MessageParameter {
	name: string;
	start: number;
	end: number;
}

export type RecursiveRecord<T> = {
	[key: string]: T | RecursiveRecord<T>;
};

export type LocaleSource = {
	messages: RecursiveRecord<string>;
};
