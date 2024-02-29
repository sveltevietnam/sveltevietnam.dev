<script>
	import { page } from '$app/stores';
	import { ROUTE_MAP } from '$lib/routing/routing.map';
</script>

<main class="grid h-screen w-screen place-items-center text-center">
	<section>
		<h1 class="c-text-h1 font-bold">{$page.status}</h1>
		<p>Oops, {$page.error?.message}</p>
		<label class="mt-6 block" for="blue-screen-toggler">
			<a class="c-link" href={ROUTE_MAP.blueScreenOfDeath.en.path}>Would you like a blue screen?</a>
		</label>
		<input type="checkbox" id="blue-screen-toggler" hidden checked={false} />
	</section>
</main>
