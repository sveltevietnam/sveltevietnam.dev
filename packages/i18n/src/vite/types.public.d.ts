import type { BuildMode } from '../builder';
import type { ParseLocaleOptions } from '../parser';

export interface Config {
	/** directory path containing locale source files, relative to vite project root */
	input: string;
	/** directory path for build artifacts, relative to vite project root */
	output: string;
	/**
	 * build mode
	 *
	 * @remark remote mode is currently experimental, support fetching messages from `query.batch` remote function
	 *
	 * @default 'remote'
	 */
	mode?: BuildMode;
	/** optional options passed while parsing locale source files */
	parseOptions?: ParseLocaleOptions;
}
