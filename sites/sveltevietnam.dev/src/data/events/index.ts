import type * as t from './types';
export type * from './types';

export function defineEventMetadata(metadata: t.MinimalEvent): t.MinimalEvent {
	return metadata;
}

const metadataModules = import.meta.glob<t.EventMetadataModule>('./*/metadata.ts');

export const ids = Object.keys(metadataModules)
	.map((path) => path.split('/')[1])
	.sort((a, b) => (a > b ? -1 : 1));
