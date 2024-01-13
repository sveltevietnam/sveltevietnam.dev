<script lang="ts">
	import { onMount } from 'svelte';

	import { modalStore } from '$lib/modals';
	import { WireframeVersionNotice } from '$lib/modals/WireframeVersionNotice';
	import { WireframeVersionNoticeCache } from '$lib/modals/WireframeVersionNotice/WireframeVersionNotice.cache';

	onMount(() => {
		const cache = new WireframeVersionNoticeCache();
		if (cache.shouldShow !== false) {
			modalStore.push({ component: WireframeVersionNotice });
		}
	});
</script>

<slot />
