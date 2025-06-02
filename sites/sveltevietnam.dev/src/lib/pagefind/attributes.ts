export type PagefindPageGroup = 'general' | 'blog' | 'jobs' | 'events' | 'people';
type PagefindPageImportance = 'top' | 'detail' | 'highlight' | 'listing' | 'other';

const groupToWeight: Record<PagefindPageGroup, number> = {
	general: 1,
	events: 10,
	jobs: 20,
	blog: 30,
	people: 40,
};

const importantToWeightShift: Record<PagefindPageImportance, number> = {
	top: 0,
	detail: 2,
	highlight: 4,
	listing: 6,
	other: 8,
};

export type Config = {
	group?: PagefindPageGroup;
	importance?: PagefindPageImportance;
};

export function page(config: Config = {}) {
	const { group = 'general', importance = 'top' } = config;
	const weight = groupToWeight[group] + importantToWeightShift[importance];
	return {
		'data-pagefind-body': '',
		'data-pagefind-filter': `group:${group}`,
		'data-pagefind-sort': `weight:${weight}`,
	};
}
