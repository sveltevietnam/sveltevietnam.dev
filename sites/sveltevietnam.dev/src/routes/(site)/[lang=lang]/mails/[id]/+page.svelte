<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { formatFullDateAndTime } from '@sveltevietnam/kit/utilities/datetime';

	import { SubscriberUpdateForm } from '$lib/forms/subscriber';

	import type { PageProps } from './$types';

	const { routing } = Contexts.get();

	let { data }: PageProps = $props();

	let iframe: HTMLIFrameElement | null = null;
	function handleIframeLoad(e: Event) {
		iframe = e.currentTarget as HTMLIFrameElement;
		if (iframe && iframe.contentWindow) {
			iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
			iframe.contentWindow.document.body.style.overflow = 'hidden';
		}
	}
	function onWindowResize() {
		if (!iframe) return;
		iframe.style.removeProperty('height');
		setTimeout(() => {
			if (iframe && iframe.contentWindow) {
				iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
			}
		}, 0);
	}
</script>

<svelte:window onresize={onWindowResize} />

<main
	class="max-w-pad pt-intro-pad-top bg-gradient-primary-intro tablet:gap-20 widescreen:gap-32 pb-section-more flex flex-wrap justify-between gap-10"
	data-pagefind-ignore
>
	<div class="w-140 min-w-80 space-y-10">
		<h1 class="sr-only">{data.mail.subject}</h1>
		<!-- mail info -->
		<section class="space-y-6">
			<h2 class="c-text-heading border-b">
				<T key="pages.mail.email.heading" />
			</h2>
			<dl class="grid grid-cols-[auto_1fr] gap-x-4">
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold">
						<T key="pages.mail.email.subject" />:
					</dt>
					<dd>{data.mail.subject}</dd>
				</div>
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold">
						<T key="from" />:
					</dt>
					<dd>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html '<!--email_off-->'}{data.mail.from}{@html '<!--/email_off-->'}
						(<T key="svelte_vietnam.name" />)
					</dd>
				</div>
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold">
						<T key="to" />:
					</dt>
					<dd>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html '<!--email_off-->'}{data.mail.to}{@html '<!--/email_off-->'}
					</dd>
				</div>
				<div class="col-span-2 grid grid-cols-subgrid py-4">
					<dt class="font-semibold">
						<T key="pages.mail.email.sent" />:
					</dt>
					<dd>{formatFullDateAndTime(routing.lang, data.mail.sentAt)}</dd>
				</div>
			</dl>
		</section>

		<!-- subscriber info -->
		{#if data.form}
			<section class="space-y-6">
				<h2 class="c-text-heading border-b">
					<T key="pages.mail.subscriber.heading" />
				</h2>
				<SubscriberUpdateForm data={data.form} />
			</section>
		{/if}
	</div>

	<!-- mail as html -->
	<section class="max-w-readable-relaxed min-w-120 flex-1 space-y-6">
		<h2 class="sr-only">Mail</h2>
		<p class="c-callout c-callout--warning">
			<T
				key="pages.mail.expiration"
				params={{ datetime: formatFullDateAndTime(routing.lang, data.expiresAt) }}
			/>
		</p>
		<div class="border-onehalf tablet:p-4 tablet:max-h-[72vh] h-fit overflow-auto p-2">
			<iframe
				class="h-140 max-h-none w-full"
				srcdoc={data.srcdoc}
				title={data.mail.subject}
				onload={handleIframeLoad}
			></iframe>
		</div>
	</section>
</main>
