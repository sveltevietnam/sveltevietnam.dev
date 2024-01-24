<script lang="ts">
	export let scheme: App.ColorScheme;
</script>

<div class="p-1">
	<div
		class="space-y-2 rounded-md bg-bg-200 p-2 {scheme === 'system' ? 'light' : scheme}"
		data-scheme={scheme}
	>
		<div class="space-y-2 rounded-md bg-bg p-2">
			<div class="h-2 w-[80px] rounded-lg bg-bg-200"></div>
			<div class="h-2 w-[100px] rounded-lg bg-bg-200"></div>
		</div>

		<div class="flex items-center space-x-2 rounded-md bg-bg p-2">
			<div class="h-4 w-4 rounded-full bg-bg-200"></div>
			<div class="h-2 w-[100px] rounded-lg bg-bg-200"></div>
		</div>

		<div class="flex items-center space-x-2 rounded-md bg-bg p-2">
			<div class="h-4 w-4 rounded-full bg-bg-200"></div>
			<div class="h-2 w-[100px] rounded-lg bg-bg-200"></div>
		</div>
	</div>
</div>

<style lang="postcss">
	[data-scheme='system'] {
		position: relative;
		overflow: hidden;

		&::after {
			content: '';

			position: absolute;
			inset: 0;

			/*
				backdrop-filter: invert(0.8);

				better than background-color not not working on Chromium at the moment
			 */

			background-color: rgba(0 0 0 / 60%);
			clip-path: polygon(0% 100%, 100% 0%, 100% 100%);
		}
	}
</style>
