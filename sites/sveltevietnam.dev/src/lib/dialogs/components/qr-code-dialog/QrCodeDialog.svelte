<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { createQrPngDataUrl } from '@svelte-put/qr';
	import { qr, type SvgQRParameter } from '@svelte-put/qr/svg';
	import { T } from '@sveltevietnam/i18n';
	import { onMount } from 'svelte';

	import * as m from '$data/locales/generated/messages';
	import { light, dark } from '$data/logos';
	import { enhanceDialog } from '$lib/dialogs/enhanced-dialog';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		item,
		data,
		filename = 'qr.png',
	}: StackItemProps & { data: string; filename?: string } = $props();

	const settings = SettingsContext.get();

	const config: SvgQRParameter = $derived({
		data,
		shape: 'circle',
		logo: settings.colorScheme.resolved === 'dark' ? dark : light,
	});
	let href = $state('');

	onMount(async () => {
		href = await createQrPngDataUrl({
			...config,
			logo: light,
			width: 500,
			height: 500,
			backgroundFill: 'white',
		});
	});
</script>

<dialog {...enhanceDialog(item, settings)}>
	<form class="space-y-6" method="dialog">
		<!-- svelte-ignore a11y_autofocus -->
		<button class="c-link-lazy absolute right-4 top-4 p-2" autofocus formmethod="dialog">
			<span class="sr-only"><T message={m.close} /></span>
			<i class="i i-[ph--x] h-6 w-6"></i>
		</button>
		<p class="c-text-title border-b"><T message={m['dialogs.qr.title']} /></p>
		<p><T message={m['dialogs.qr.desc']} /></p>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			use:qr={config}
			width="320"
			height="320"
			class="mx-auto h-80 w-80 max-w-full"
		/>
		{#if href}
			<a class="c-btn mx-auto block" {href} download={filename}><T message={m.download} /></a>
		{/if}
	</form>
</dialog>
