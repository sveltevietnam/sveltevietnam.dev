/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BrowserCacheServiceConstructor<Data> {
	new (...args: any[]): BrowserCacheService<Data>;
}

export class BrowserCacheService<Data> {
	public get key(): string {
		throw new Error('Do not use directly, use decorator instead');
	}

	public get storage(): Storage {
		throw new Error('Do not use directly, use decorator instead');
	}

	public set(cache: Data): Data {
		if (this.storage) {
			this.storage.setItem(this.key, JSON.stringify(cache));
		}
		return cache;
	}

	public get(): Data | null {
		const cache = this.storage?.getItem(this.key);
		if (cache) {
			return JSON.parse(cache) as Data;
		}
		return null;
	}
}
