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

	#pagefind = $state<App.PageFind | null>(null);
	query = $state<string>('');
	results = $derived.by<Promise<SearchResult[]> | null>(() => {
		if (!this.#pagefind || !this.query) return null;
		const results = this.#pagefind
			.debouncedSearch(this.query, {
				sort: {
					weight: 'asc',
				},
			})
			.then((searched) =>
				Promise.all(
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
				),
			);
		return results;
	});

	/** whether to clip the results (show only the first 3) */
	clip = $state<SearchClip>({
		results: false,
		subResults: {},
	});

	constructor(origin: string) {
		if (browser) {
			import(/* @vite-ignore */ `${origin}/pagefind/pagefind.js`).then((m: App.PageFind) => {
				this.#pagefind = m;
				this.#pagefind.init();
			});

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

		$effect(() => {
			if (!this.results) return;
			this.results.then((results) => {
				this.clip = {
					results: results.length > 3,
					subResults: Object.fromEntries(
						results.map((result) => [result.id, result.subResults.length > 3]),
					),
				};
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
