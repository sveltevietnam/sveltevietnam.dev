<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { SubscriberUpdateForm } from '$lib/forms/subscriber';
	import { SettingsContext } from '$lib/settings/context.svelte';
	import { formatFullDateAndTime } from '$lib/utils/datetime';

	import type { PageData } from './$types';

	const settings = SettingsContext.get();

	let { data }: { data: PageData } = $props();

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
	class="max-w-pad pt-intro-pad-top bg-gradient-primary-intro tablet:gap-20 widescreen:gap-32 pb-section-more flex
	flex-wrap justify-between gap-10"
>
	<div class="flex-1 space-y-10">
		<h1 class="sr-only">{data.mail.subject}</h1>
		<!-- mail info -->
		<section class="space-y-6">
			<h2 class="c-text-heading border-b">
				<T message={m['pages.mail.email.heading']} />
			</h2>
			<dl class="grid grid-cols-[auto_1fr] gap-x-4">
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold">
						<T message={m['pages.mail.email.subject']} />:
					</dt>
					<dd>{data.mail.subject}</dd>
				</div>
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold">
						<T message={m['pages.mail.email.from']} />:
					</dt>
					<dd><T message={m['svelte_vietnam.name']} /></dd>
				</div>
				<div class="border-b-onehalf col-span-2 grid grid-cols-subgrid border-dashed py-4">
					<dt class="font-semibold">
						<T message={m['pages.mail.email.to']} />:
					</dt>
					<dd>{data.mail.email}</dd>
				</div>
				<div class="col-span-2 grid grid-cols-subgrid py-4">
					<dt class="font-semibold">
						<T message={m['pages.mail.email.sent']} />:
					</dt>
					<dd>{formatFullDateAndTime(settings.language, data.mail.sentAt)}</dd>
				</div>
			</dl>
		</section>

		<!-- subscriber info -->
		<section class="space-y-6">
			<h2 class="c-text-heading border-b">
				<T message={m['pages.mail.subscriber.heading']} />
			</h2>
			<SubscriberUpdateForm data={data.form} />
		</section>
	</div>

	<!-- mail as html -->
	<section class="max-w-readable min-w-80 flex-1 space-y-6">
		<h2 class="sr-only">Mail</h2>
		<p class="c-callout c-callout--warning isolate">
			<T
				message={m['pages.mail.expiration']}
				datetime={formatFullDateAndTime(settings.language, data.expiresAt)}
			/>
		</p>
		<div class="border-onehalf h-fit p-2 tablet:p-4">
			<iframe
				class="h-140 max-h-none w-full"
				srcdoc={data.srcdoc}
				title={data.mail.subject}
				onload={handleIframeLoad}
			></iframe>
		</div>
	</section>
</main>
