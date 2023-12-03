```svelte
<!-- +page.svelte -->

<script>
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
</script>

<main>
	<Breadcrumbs />
	<h1 class="tp-h1">Title</h1>
	<p>Description</p>
</main>

<style>
	h1 {
		color: blue;
	}
</style>
```
