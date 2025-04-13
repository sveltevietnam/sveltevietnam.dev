<script lang="ts">
	let { lang }: { lang: string } = $props();

	const langToIconClass = {
		js: 'i-[simple-icons--javascript]',
		javascript: 'i-[simple-icons--javascript]',
		ts: 'i-[simple-icons--typescript]',
		typescript: 'i-[simple-icons--typescript]',
		css: 'i-[simple-icons--css]',
		html: 'i-[simple-icons--html5]',
		markdown: 'i-[simple-icons--markdown]',
		md: 'i-[simple-icons--markdown]',
		svelte: 'i-[simple-icons--svelte]',
		bash: 'i-[simple-icons--gnometerminal]',
		sh: 'i-[simple-icons--gnometerminal]',
	};
	const iconClass = $derived(langToIconClass[lang] || 'i-[ph--code-block]');
</script>

<i class="i {iconClass}"></i>

<style>
	i {
		width: 1rem; /* 16px */
		height: 1rem; /* 16px */
	}
</style>
