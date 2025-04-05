<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { createQrPngDataUrl } from '@svelte-put/qr';
	import { qr, type SvgQRParameter } from '@svelte-put/qr/svg';
	import { T } from '@sveltevietnam/i18n';
	import { onMount } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { light, dark } from '$data/logos';
	import { enhancedialog } from '$lib/dialogs/enhanced-dialog';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		item,
		data,
		filename = 'qr.png',
		class: cls,
		...rest
	}: HTMLDialogAttributes &
		StackItemProps & {
			data: string;
			filename?: string;
		} = $props();

	let dialog: HTMLDialogElement;

	const settings = SettingsContext.get();

	const config: SvgQRParameter = $derived({
		data,
		shape: 'circle',
		logo: settings.colorScheme.resolved === 'dark' ? dark : light,
	});
	let href = $state('');

	function checkAndResolve() {
		// when dialog has closed and animation has finished, resolve
		if (!dialog.open) {
			item.resolve();
			settings.toggleScrollLock(false);
		}
	}

	onMount(async () => {
		settings.toggleScrollLock(true);
		dialog?.showModal();
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
	class={[
		'backdrop:bg-surface bg-surface tablet:p-8 space-y-6 border-2 p-6 shadow-lg backdrop:opacity-80',
		cls,
	]}
	use:enhancedialog
	onanimationend={checkAndResolve}
	onclickbackdrop={() => dialog?.close()}
	bind:this={dialog}
	{...rest}
>
	<!-- svelte-ignore a11y_autofocus -->
	<button class="c-link-lazy absolute right-4 top-4 p-2" onclick={() => dialog?.close()} autofocus>
		<span class="sr-only"><T message={m.close} /></span>
		<i class="i i-[x] h-6 w-6"></i>
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
</dialog>

<style lang="postcss">
	dialog {
		inset: 0;

		display: block; /* required for animation to work */

		margin: auto;

		animation-name: fly-out-down;
		animation-duration: 150ms;
		animation-timing-function: var(--default-transition-timing-function);
		animation-fill-mode: forwards;
	}

	dialog[open] {
		animation-name: fly-in-up;
	}

	@keyframes fly-in-up {
		from {
			transform: translateY(50px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes fly-out-down {
		from {
			transform: translateY(0);
			opacity: 1;
		}

		to {
			transform: translateY(50px);
			opacity: 0;
		}
	}
</style>
