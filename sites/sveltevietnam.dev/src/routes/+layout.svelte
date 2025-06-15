<script>
	import '@sveltevietnam/css/layers';

	import '$lib/styles/app.css';

	let { children } = $props();
</script>

{@render children()}
