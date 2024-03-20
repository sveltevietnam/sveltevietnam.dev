<script lang="ts">
	import { enhance } from '$app/forms';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { Countdown } from '$lib/components/Countdown';
	import EventListItem from '$lib/components/EventListItem/EventListItem.svelte';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { isValidDate } from '$lib/utils/datetime';

	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: t = data.translations.page;
</script>

<main>
	<div class="heading-container max-w-pad mt-6 space-y-10">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} scrollIndicator="ellipsis" />
		<h1 class="c-text-h1">{t.title}</h1>
	</div>
	<div class="max-w-pad mt-[120px] space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		{#if data.status === 'ongoing'}
			<section class="c-card-action mx-auto max-w-xl">
				{#if !form && data.form.already}
					<p class="c-callout c-callout--success">{t.checkin.success.already}</p>
				{:else}
					<p class="mt-6">
						{#if data.form.method === 'form'}
							{t.checkin.description.form}
						{:else}
							{t.checkin.description.qr}
						{/if}
					</p>
					<form method="POST" use:enhance class="mt-6 space-y-6">
						<input
							class="c-input"
							name="email"
							type="email"
							required
							placeholder="Email"
							value={data.form.email ?? ''}
							hidden={data.form.method === 'qr'}
						/>
						<input name="event" type="text" required value={data.form.event} hidden />
						<input name="method" type="text" required value={data.form.method} hidden />
						{#if form}
							{@const { success, message } = form}
							<p
								class="c-callout"
								class:c-callout--error={!success}
								class:c-callout--success={success}
							>
								{message}
							</p>
						{/if}
						{#if !form?.success && !data.form.already}
							<button type="submit" class="c-btn w-full" disabled={form?.success}>Check in</button>
						{/if}
					</form>
				{/if}
			</section>
			<!-- candidate for Svelte 5 snippet -->
			{#if isValidDate(data.event.startDate)}
				<section class="space-y-10">
					<h2 class="c-text-h3 text-center font-medium">{t.countdown}</h2>
					<Countdown date={data.event.startDate} />
				</section>
			{/if}
		{/if}

		{#if data.status === 'upcoming'}
			<!-- candidate for Svelte 5 snippet -->
			{#if isValidDate(data.event.startDate)}
				<section class="space-y-10">
					<h2 class="c-text-h3 text-center font-medium">{t.countdown}</h2>
					<Countdown date={data.event.startDate} />
				</section>
			{/if}
			<ToBeAnnounced>
				<p class="text-center leading-loose">{@html t.upcoming}</p>
			</ToBeAnnounced>
		{/if}

		{#if data.status == 'past'}
			<ToBeAnnounced>
				<p class="text-center leading-loose">{@html t.past}</p>
			</ToBeAnnounced>
		{/if}

		<EventListItem event={data.event} />
	</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.neutral.DEFAULT');
	}
</style>
