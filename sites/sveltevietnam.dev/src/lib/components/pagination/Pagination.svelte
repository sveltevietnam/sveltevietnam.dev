<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		url,
		current,
		max,
		class: cls,
		...rest
	}: {
		url: URL;
		current: number;
		max: number;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<nav class={['flex w-fit items-center gap-4', cls]} aria-labelledby="pagination-label" {...rest}>
	<p class="sr-only"><T key="components.pagination.aria" /></p>
	<form class="flex items-center gap-2" method="GET" action={url.toString()}>
		<p><T key="components.pagination.page" /></p>
		<label class="sr-only" for="page"><T key="components.pagination.number" /></label>

		<input
			class="appearance-none border border-current px-2 py-1"
			style:width="{1.75 + 1.5 * max.toString().length}ch"
			type="number"
			{max}
			min="1"
			step="1"
			name="page"
			id="page"
			value={current}
		/>
		<p><T key="components.pagination.of" /> <strong>{max}</strong></p>
	</form>
	<form class="flex items-center gap-2" method="GET" action={url.toString()}>
		<label
			class={[
				'c-link-lazy cursor-pointer border border-current px-1.5 py-1',
				'has-disabled:text-placeholder has-disabled:cursor-not-allowed',
			]}
		>
			<span class="sr-only"><T key="components.pagination.previous" /></span>
			<i class="i i-[ph--caret-left] h-5 w-5"></i>
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
				'has-disabled:text-placeholder has-disabled:cursor-not-allowed',
			]}
		>
			<span class="sr-only"><T key="components.pagination.next" /></span>
			<i class="i i-[ph--caret-right] h-5 w-5"></i>
			<input
				class="sr-only"
				type="submit"
				value={current + 1}
				name="page"
				disabled={current >= max}
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
