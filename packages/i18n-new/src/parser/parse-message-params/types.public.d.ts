export interface MessageParameter {
	/** name of parameter */
	name: string;
	/**
	 * position of this param relative to the message content string
	 * (start is inclusive, end is exclusive)
	 *
	 * @example
	 * ```
	 * message: "Hello, {{name}}!"
	 *                  ↑       ↑
	 *              start=7  end=15
	 * ```
	 */
	positions: {
		start: number;
		end: number;
	}[];
}
