<script lang="ts">
	let { lang }: { lang: string } = $props();
	import './icons.css';
</script>

<i class="i i-{lang}"></i>

<style>
	i {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}
</style>
