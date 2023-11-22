<script lang="ts">
	export let variant: 'text' | 'figure' = 'figure';
	let cls = '';
	export { cls as class };
</script>

{#if variant === 'text'}
	<div class="w-full rounded-[16px] border pb-14 pt-20 {cls}">
		<svg inline-src="tba" width="323" height="94" class="mx-auto max-w-full" />
		<div class="mt-10">
			<slot />
		</div>
	</div>
{:else if variant === 'figure'}
	<div class="{cls} flex w-full flex-col items-center justify-center rounded-[16px] border p-8">
		<svg inline-src="./tba-figure.svg" class="m-auto w-[357px] max-w-full" />
		<div class="mt-6">
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	svg :global(.__megaphone) {
		@light global {
			fill: black;
		}
	}
</style>
