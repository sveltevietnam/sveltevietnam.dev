export interface MessageParameter {
	name: string;
	positions: {
		start: number;
		end: number;
	}[];
}
