import { getContext, setContext } from 'svelte';

import { build } from './utils';

export class RoutingContext {
	static KEY = 'app:routing';

	#map = $state<Record<App.RouteKey, App.Route>>();
	#key = $state<App.RouteKey>();
	paths = $state<Record<App.Language, App.Route>>({
		en: { path: '/en', name: 'Home' },
		vi: { path: '/vi', name: 'Trang Chủ' },
	});

	constructor(data: App.PageData['routing']) {
		this.#map = data.map;
		this.#key = data.key;
		this.paths = data.paths;
	}

	path(key: App.RouteKey, ...params: string[]) {
		const path = this.#map?.[key].path;
		if (!path) return undefined;
		return build(path, ...params);
	}

	name(key: App.RouteKey, ...params: string[]) {
		const name = this.#map?.[key].name;
		if (!name) return undefined;
		return build(name, ...params);
	}

	is(key: App.RouteKey) {
		return this.#key === key;
	}

	update(data: App.PageData['routing']) {
		this.#map = data.map;
		this.#key = data.key;
		this.paths = data.paths;
	}

	static set(data: App.PageData['routing']) {
		return setContext(RoutingContext.KEY, new RoutingContext(data));
	}

	static get() {
		return getContext(RoutingContext.KEY) as RoutingContext;
	}
}
