<script lang="ts">
	import JobPosting from './JobPosting.svelte';

	import type { JobPostingListProps } from '.';

	let { i18n, postings, class: cls, ...rest }: JobPostingListProps = $props();
</script>

<ul class={['tablet:grid-cols-2 desktop:gap-10 grid grid-cols-1 gap-8', cls]} {...rest}>
	{#each postings as posting (posting.id)}
		<li><JobPosting {i18n} {posting} /></li>
	{/each}
</ul>
