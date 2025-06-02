import { getContext, setContext } from 'svelte';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

export class RoutingContext {
	static KEY = Symbol('app:routing');

	breadcrumbs = $state<
		{
			path: string;
			name: string;
		}[]
	>(b['/:lang']({ lang: 'en' }));
	paths = $state<NonNullable<App.PageData['routing']>['paths']>({
		en: p['/:lang']({ lang: 'en' }),
		vi: p['/:lang']({ lang: 'vi' }),
	});

	constructor(data: App.PageData['routing']) {
		if (!data) return;
		this.paths = data.paths;
		if (data.breadcrumbs) {
			this.breadcrumbs = data.breadcrumbs;
		}
	}

	is(path: string) {
		return this.paths.en === path || this.paths.vi === path;
	}

	// FIXME: implement some mechanism to automatically
	// update context with page changes without
	// having to call this manually
	update(data: App.PageData['routing']) {
		if (!data) return;
		this.paths = data.paths;
		if (data.breadcrumbs) {
			this.breadcrumbs = data.breadcrumbs;
		}
	}

	static set(data: App.PageData['routing']) {
		return setContext(RoutingContext.KEY, new RoutingContext(data));
	}

	static get() {
		return getContext(RoutingContext.KEY) as RoutingContext;
	}
}
