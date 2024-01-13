import { BrowserCache, BrowserCacheService } from '$lib/cache/browser';

export interface WireframeVersionNoticeCacheData {
	shouldShow: boolean | null;
}

@BrowserCache<WireframeVersionNoticeCacheData>({
	key: 'wireframe-version-notice',
	storage: 'local',
	defaultCache: {
		shouldShow: null,
	},
})
export class WireframeVersionNoticeCache extends BrowserCacheService<WireframeVersionNoticeCacheData> {
	get shouldShow() {
		return this.get()?.shouldShow ?? null;
	}
	set shouldShow(value: WireframeVersionNoticeCacheData['shouldShow']) {
		this.set({ shouldShow: value });
	}
}
