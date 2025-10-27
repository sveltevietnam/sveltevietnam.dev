<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';

	let { children } = $props();
</script>

<table class="border-outline w-full border-collapse border max-w-256">
	<thead>
		<tr class="bg-surface-variant text-left *:border *:px-3 *:py-2">
			<th scope="col"><T key="pages.roadmap.common.task" /></th>
			<th class="tablet:w-44 w-24" scope="col"><T key="pages.roadmap.common.progress" /></th>
		</tr>
	</thead>
	<tbody>
		{@render children?.()}
	</tbody>
</table>
