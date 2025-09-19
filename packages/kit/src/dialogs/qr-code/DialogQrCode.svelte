<script lang="ts">
	import { enhanceDialog } from '@svelte-put/async-stack/helpers';
	import { createQrPngDataUrl } from '@svelte-put/qr';
	import { qr, type SvgQRParameter } from '@svelte-put/qr/svg';
	import { T } from '@sveltevietnam/i18n/runtime';
	import { onMount } from 'svelte';

	import dark from '../../assets/images/logos/monotone-dark.base64?raw';
	import light from '../../assets/images/logos/monotone-light.base64?raw';

	import type { DialogQrCodeProps } from '.';

	let {
		item,
		data,
		filename = 'qr.png',
		class: cls,
		theme,
		i18n,
		...rest
	}: DialogQrCodeProps = $props();

	let config: SvgQRParameter = $derived({
		data,
		shape: 'circle',
		logo: theme() === 'dark' ? dark : light,
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

<dialog
	class={['c-dialog', cls]}
	{...enhanceDialog(item, { delayResolution: 'animationend' })}
	{...rest}
>
	<form class="space-y-6" method="dialog">
		<button class="c-link-lazy absolute right-4 top-4 p-2" formmethod="dialog">
			<span class="sr-only"><T message={i18n.close} /></span>
			<i class="i i-[ph--x] h-6 w-6"></i>
		</button>
		<p class="c-text-title border-b"><T message={i18n.title} /></p>
		<p><T message={i18n.desc} /></p>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			use:qr={config}
			width="320"
			height="320"
			class="mx-auto h-80 w-80 max-w-full"
		></svg>
		{#if href}
			<a
				class="c-btn mx-auto block"
				download={filename}
				{href}
			>
				<T message={i18n.download} />
			</a>
		{/if}
	</form>
</dialog>
