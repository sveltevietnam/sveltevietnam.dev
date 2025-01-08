<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		url,
		current,
		total,
		locale,
		class: cls,
		...rest
	}: {
		url: URL;
		current: number;
		total: number;
		locale: import('./locales/generated').Locale;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<nav class={['flex w-fit items-center gap-4', cls]} aria-label={locale.aria} {...rest}>
	<form class="flex items-center gap-2" method="GET" action={url.toString()}>
		<p><T message={locale.page} /></p>
		<label class="sr-only"><T message={locale.number} /></label>
		<input
			class="appearance-none border border-current px-2 py-1"
			style:width="{1.75 + 1.5 * total.toString().length}ch"
			type="number"
			max={total}
			min="1"
			step="1"
			name="page"
			id="page"
			value={current}
		/>
		<p><T message={locale.of} /> <strong>{total}</strong></p>
	</form>
	<form class="flex items-center gap-2" method="GET" action={url.toString()}>
		<label
			class={[
				'c-link-lazy cursor-pointer border border-current px-1.5 py-1',
				'has-disabled:cursor-not-allowed has-disabled:text-placeholder',
			]}
		>
			<span class="sr-only"><T message={locale.previous} /></span>
			<i class="i i-[caret-left] h-5 w-5"></i>
			<input
				class="sr-only"
				type="submit"
				value={current - 1}
				name="page"
				disabled={current <= 1}
			/>
		</label>
		<label
			class={[
				'c-link-lazy cursor-pointer border border-current px-1.5 py-1',
				'has-disabled:cursor-not-allowed has-disabled:text-placeholder',
			]}
		>
			<span class="sr-only"><T message={locale.next} /></span>
			<i class="i i-[caret-right] h-5 w-5"></i>
			<input
				class="sr-only"
				type="submit"
				value={current + 1}
				name="page"
				disabled={current >= total}
			/>
		</label>
	</form>
</nav>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		margin: 0;
		appearance: none;
	}

	/* Firefox */
	input[type='number'] {
		appearance: textfield;
	}
</style>
