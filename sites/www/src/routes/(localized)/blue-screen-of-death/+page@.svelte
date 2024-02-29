<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="max-w-pad space-y-10 overflow-auto text-left text-white">
	<h1>:)</h1>
	<p>
		Oh nice. You have reached the "Blue Screen of Death". The application is absolutely fine; as is
		your computer. We are definitely, 100%, not collecting any personal information (~_^).
	</p>
	<p>As with anything, try turning it off and on again.</p>
	<div class="flex items-center gap-6">
		<img src={data.discordQR} width="128" height="128" alt="QR to discord.sveltevietnam.dev" />
		<div class="space-y-2 text-base">
			<p>While you are at it, join our discord for fun, yeah?</p>
			<p class="text-xs">(We won't be able to fix YOUR error anyway)</p>
		</div>
	</div>
</main>

<style lang="postcss">
	main {
		min-height: 100dvh;
		padding-block: 40px;

		font-size: 1.5rem;
		line-height: 1.5;

		background-color: #0078d7;

		@screen pc {
			padding-block: 80px;
		}
	}

	h1 {
		font-size: 5rem;
		line-height: normal;
	}
</style>
