<script lang="ts">
	import { page } from '$app/state';
	import * as p from '$data/routes/generated';
</script>

<main class="grid h-screen w-screen place-items-center text-center">
	<section>
		<h1 class="c-text-heading-page font-bold">{page.status}</h1>
		<p>Oops, [{page.error?.code || 'SV000'}] {page.error?.message}</p>
		<label class="mt-6 block" for="blue-screen-toggler">
			<a class="c-link" href={p['/blue-screen-of-death']()}> Would you like a blue screen? </a>
		</label>
		<input type="checkbox" id="blue-screen-toggler" hidden checked={false} />
	</section>
</main>
