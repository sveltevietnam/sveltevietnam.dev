<script>
	import { page } from '$app/stores';
	import BlueScreenOfDeath from '$lib/client/services/easter/BlueScreenOfDeath.svelte';
</script>

<main class="grid h-screen w-screen place-items-center text-center">
	<section>
		<h1 class="c-text-h1 font-bold">{$page.status}</h1>
		<p>Oops, {$page.error?.message}</p>
		<label class="mt-6 block" for="blue-screen-toggler">
			<p class="c-link cursor-pointer">Would you like a blue screen?</p>
		</label>
		<input type="checkbox" id="blue-screen-toggler" hidden checked={false} />
		<div id="blue-screen">
			<BlueScreenOfDeath />
		</div>
	</section>
</main>

<style lang="postcss">
	#blue-screen {
		display: none;
	}

	#blue-screen-toggler:checked + #blue-screen {
		display: block;
	}
</style>
