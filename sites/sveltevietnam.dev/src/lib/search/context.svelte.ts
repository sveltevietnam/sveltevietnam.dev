import { setContext, getContext } from 'svelte';

import { browser } from '$app/environment';

type SearchResult = {
	id: string;
	title: string;
	url: string;
	subResults: {
		id: string;
		url: string;
		title: string;
		excerpt: string;
	}[];
};

type SearchClip = {
	results: boolean;
	subResults: Record<string, boolean>;
};

export class SearchContext {
	static KEY = Symbol('app:dialogs');

	#pagefind = $state<import('@pagefind').default | null>(null);
	query = $state<string>('');
	results = $state<SearchResult[] | null>(null);
	/** whether to clip the results (show only the first 3) */
	clip = $state<SearchClip>({
		results: false,
		subResults: {},
	});
	searching = $state<boolean>(false);

	constructor(origin: string) {
		if (browser) {
			import(/* @vite-ignore */ `${origin}/pagefind/pagefind.js`).then(
				(m: import('@pagefind').default) => {
					this.#pagefind = m;
					this.#pagefind.init();
				},
			);

			// subscribe to lang on html
			const observer = new MutationObserver(() => {
				if (this.#pagefind) {
					this.#pagefind.destroy();
					this.#pagefind.init();
					this.query = '';
				}
			});
			observer.observe(document.documentElement, {
				attributeFilter: ['lang'],
			});
		}

		// FIXME: would be great if can avoid $effect here
		$effect(() => {
			if (!this.#pagefind || !this.query) return;
			this.searching = true;
			this.#pagefind
				.debouncedSearch(
					this.query,
					{
						sort: {
							weight: 'asc',
						},
					},
					100,
				)
				.then(async (searched) => {
					if (!searched?.results?.length) {
						this.results = null;
						this.clip = {
							results: false,
							subResults: {},
						};
						return;
					}
					this.results = await Promise.all(
						(searched?.results ?? []).map(async (result) => {
							const data = await result.data();
							return {
								id: result.id,
								title: data.meta.title,
								url: data.url,
								subResults: data.sub_results.map((sub) => ({
									id: sub.anchor?.id ?? sub.url,
									url: sub.url,
									title: sub.title.startsWith('#') ? sub.title.slice(1) : sub.title,
									excerpt: sub.excerpt,
								})),
							};
						}),
					);
					this.clip = {
						results: this.results.length > 3,
						subResults: Object.fromEntries(
							this.results.map((result) => [result.id, result.subResults.length > 3]),
						),
					};
					this.searching = false;
				});
		});
	}

	static set(origin: string) {
		return setContext<SearchContext>(SearchContext.KEY, new SearchContext(origin));
	}

	static get() {
		return getContext<SearchContext>(SearchContext.KEY);
	}
}
