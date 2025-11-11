<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { EMAILS } from '@sveltevietnam/kit/constants';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import { formatFullDateAndTime } from '@sveltevietnam/kit/utilities/datetime';

	import { browser } from '$app/environment';
	import { getWebMail } from '$lib/domains/mail/functions.remote';
	import { UpdateSubscriptionForm } from '$lib/domains/subscriber/update-subscription';

	const routing = RoutingContext.get();

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

	let mail = $derived(await getWebMail());
</script>

<svelte:window onresize={onWindowResize} />

<main
	class="max-w-pad pt-intro-pad-top bg-gradient-primary-intro tablet:gap-20 widescreen:gap-24 pb-section-more flex flex-wrap justify-between gap-10"
	data-pagefind-ignore
>
	<div class="min-w-80 flex-1 space-y-10">
		<h1 class="sr-only">{mail.subject}</h1>
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
					<dd>{mail.subject}</dd>
				</div>
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold capitalize">
						<T key="from" />:
					</dt>
					<dd>
						{browser ? mail.from : EMAILS.DONOTSPAM}
						(<T key="svelte_vietnam.name" />)
					</dd>
				</div>
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold capitalize">
						<T key="to" />:
					</dt>
					<dd>
						{browser ? mail.to : EMAILS.DONOTSPAM}
					</dd>
				</div>
				<div class="col-span-2 grid grid-cols-subgrid py-4">
					<dt class="font-semibold">
						<T key="pages.mail.email.sent_at" />:
					</dt>
					<dd>{formatFullDateAndTime(routing.lang, mail.sentAt)}</dd>
				</div>
			</dl>
		</section>

		<!-- subscriber info -->
		{#if mail.actorId.startsWith('subscriber_')}
			<section class="space-y-6">
				<h2 class="c-text-heading border-b">
					<T key="pages.mail.subscriber.heading" />
				</h2>
				<UpdateSubscriptionForm subscriberId={mail.actorId} />
			</section>
		{/if}
	</div>

	<!-- mail as html -->
	<section class="max-w-readable-relaxed min-w-120 flex-1 space-y-6">
		<h2 class="sr-only">Mail</h2>
		<p class="c-callout c-callout--warning">
			<T
				key="pages.mail.expiration"
				params={{ datetime: formatFullDateAndTime(routing.lang, mail.expiredAt) }}
			/>
		</p>
		<div class="border-onehalf tablet:p-4 tablet:max-h-[72vh] h-fit overflow-auto p-2">
			<iframe
				class="h-140 max-h-none w-full"
				srcdoc={mail.html}
				title={mail.subject}
				onload={handleIframeLoad}
			></iframe>
		</div>
	</section>
</main>
