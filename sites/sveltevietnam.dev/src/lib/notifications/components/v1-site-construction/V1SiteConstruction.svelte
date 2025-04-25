<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';

	import BaseNotification from '../BaseNotification.svelte';

	let { item }: StackItemProps<boolean> = $props();

	function handleNotAgain() {
		item.resolve(true);
	}
</script>

<BaseNotification status="info" title={m['notifications.v1_site_construction.title']} {item}>
	<p><T message={m['notifications.v1_site_construction.message']} /></p>
	<button class="c-btn mt-4" onclick={handleNotAgain}>
		<T message={m['notifications.v1_site_construction.not_again']} />
	</button>
</BaseNotification>
