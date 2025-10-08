<script lang="ts">
	import { formatDate, formatDateAndTime, formatTime } from '@sveltevietnam/kit/utilities/datetime';

	export let startDate: 'TBA' | Date;
	export let endDate: 'TBA' | Date;
	export let order: 'date-first' | 'time-first' = 'date-first';
	let cls = '';
	export { cls as class };

	$: isWithinOneDay =
		(startDate.toString().toUpperCase() !== 'TBA' || endDate.toString().toUpperCase() !== 'TBA') &&
		new Date(startDate).toLocaleDateString() === new Date(endDate).toLocaleDateString();
</script>

<span class={cls}>
	{#if isWithinOneDay}
		{#if order === 'date-first'}
			{formatDate(startDate)},
		{/if}
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
		{#if order === 'time-first'}
			- {formatDate(startDate)}
		{/if}
	{:else}
		{#if startDate !== 'TBA'}
			{@const startDateD = new Date(startDate)}
			<time datetime={startDateD.toISOString()}>{formatDateAndTime(startDateD, order)}</time>
		{:else}
			<span>TBA</span>
		{/if}
		-
		{#if endDate !== 'TBA'}
			{@const endDateD = new Date(endDate)}
			<time datetime={endDateD.toISOString()}>{formatDateAndTime(endDateD, order)}</time>
		{:else}
			<span>TBA</span>
		{/if}
	{/if}
</span>

