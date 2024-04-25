<script lang="ts">
	import { enhance } from '$app/forms';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import EventListItem from '$lib/components/EventListItem/EventListItem.svelte';
	import { Timer } from '$lib/components/Timer';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { modalStore } from '$lib/modals';
	import { isValidDate } from '$lib/utils/datetime';

	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: t = data.translations.page;

	let qrEl: HTMLInputElement;

	async function scanQR() {
		const pushed = modalStore.push({
			component: (await import('$lib/modals/QRScanner')).QRScanner,
			props: {
				texts: {
					title: t.checkin.qr.modal.title,
					description: t.checkin.qr.modal.description,
				},
			},
		});

		const { data } = await pushed.resolve();
		if (data) {
			qrEl.value = data;
			qrEl.click();
		}
	}
</script>

<!-- TODO: add a link to user's email box for self check-in -->

<main>
	<div class="heading-container max-w-pad mt-6 space-y-10">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} scrollIndicator="ellipsis" />
		<h1 class="c-text-h1 font-medium">{t.title}</h1>
	</div>
	<div class="max-w-pad mt-[120px] space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		{#if data.status.checkin === 'ongoing'}
			<section class="c-card-action mx-auto max-w-[600px]">
				{#if !form && data.form.checked}
					<p class="c-callout c-callout--success">{data.form.checked}</p>
				{:else if form?.success}
					<p class="c-callout c-callout--success">{form.message}</p>
				{:else}
					<form method="POST" use:enhance class="mt-6 space-y-8">
						<input name="event" type="text" required value={data.form.event} hidden />
						{#if form && !form.success}
							<p class="c-callout c-callout--error">{form.message}</p>
						{/if}

						<!-- manual form -->
						<div class="space-y-6">
							<p>{t.checkin.form}</p>
							<input
								class="c-input"
								name="email"
								type="email"
								placeholder="Email"
								value={data.form.email ?? ''}
							/>
							<button type="submit" class="c-btn w-full" disabled={form?.success}>Check in</button>
						</div>

						<!-- separator -->
						<p
							class="flex items-center gap-4 before:h-px before:flex-1 before:bg-outline after:h-px after:flex-1 after:bg-outline"
						>
							{t.checkin.or}
						</p>

						<!-- scan QR -->
						<input name="qr" type="submit" hidden bind:this={qrEl} />
						<button type="button" class="c-btn c-btn--outlined w-full" on:click={scanQR}>
							<svg inline-src="lucide/qr-code" width="20" height="20" stroke-width="1.5" />
							{t.checkin.qr.cta}
						</button>
					</form>
				{/if}
			</section>

			<!-- candidate for Svelte 5 snippet -->
			{#if isValidDate(data.event.startDate)}
				<section class="space-y-10">
					<h2 class="c-text-h3 text-center font-medium">
						{#if data.status.event === 'upcoming'}
							{t.timer.countdown}
						{:else}
							{t.timer.elapsed}
						{/if}
					</h2>
					<Timer date={data.event.startDate} />
				</section>
			{/if}
		{/if}

		{#if data.status.checkin === 'upcoming'}
			<!-- candidate for Svelte 5 snippet -->
			{#if isValidDate(data.event.startDate)}
				<section class="space-y-10">
					<h2 class="c-text-h3 text-center font-medium">
						{#if data.status.event === 'upcoming'}
							{t.timer.countdown}
						{:else}
							{t.timer.elapsed}
						{/if}
					</h2>
					<Timer date={data.event.startDate} />
				</section>
			{/if}
			<ToBeAnnounced>
				<p class="text-center leading-loose">{@html t.upcoming}</p>
			</ToBeAnnounced>
		{/if}

		{#if data.status.checkin == 'past'}
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
