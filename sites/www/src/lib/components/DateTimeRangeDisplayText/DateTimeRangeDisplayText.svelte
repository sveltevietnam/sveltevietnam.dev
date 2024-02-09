<script lang="ts">
	import { formatDate, formatDateAndTime, formatTime } from '$lib/utils/datetime';

	export let startDate: string | Date;
	export let endDate: string | Date;
	let cls = '';
	export { cls as class };

	$: isWithinOneDay =
		(startDate.toString().toUpperCase() !== 'TBA' || endDate.toString().toUpperCase() !== 'TBA') &&
		new Date(startDate).toLocaleDateString() === new Date(endDate).toLocaleDateString();
</script>

<span class={cls}>
	{#if isWithinOneDay}
		{formatDate(startDate)},
		{#if startDate !== 'TBA'}
			{@const startDateD = new Date(startDate)}
			<time datetime={startDateD.toISOString()}>{formatTime(startDateD)}</time>
		{:else}
			<span>TBA</span>
		{/if}
		-
		{#if endDate !== 'TBA'}
			{@const endDateD = new Date(endDate)}
			<time datetime={endDateD.toISOString()}>{formatTime(endDateD)}</time>
		{:else}
			<span>TBA</span>
		{/if}
	{:else}
		{#if startDate !== 'TBA'}
			{@const startDateD = new Date(startDate)}
			<time datetime={startDateD.toISOString()}>{formatDateAndTime(startDateD)}</time>
		{:else}
			<span>TBA</span>
		{/if}
		-
		{#if endDate !== 'TBA'}
			{@const endDateD = new Date(endDate)}
			<time datetime={endDateD.toISOString()}>{formatDateAndTime(endDateD)}</time>
		{:else}
			<span>TBA</span>
		{/if}
	{/if}
</span>
