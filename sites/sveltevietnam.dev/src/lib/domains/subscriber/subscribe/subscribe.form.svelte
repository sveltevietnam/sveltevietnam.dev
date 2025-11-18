<script lang="ts" module>
	import {
		type Turnstile,
		turnstile,
		type TurnstileEventDetail,
	} from '@svelte-put/cloudflare-turnstile';
	import {
		SUBSCRIPTION_CHANNELS,
		type SubscriptionChannel,
	} from '@sveltevietnam/backend/data/subscribers/channels';
	import { Context, T } from '@sveltevietnam/i18n';
	import { RoutingContext, NotificationContext, LoadingContext } from '@sveltevietnam/kit/contexts';
	import type { ChangeEventHandler, HTMLFormAttributes } from 'svelte/elements';

	import { VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import Issues from '$lib/domains/common/FormIssues.svelte';

	import { subscribe } from './subscribe.remote';

	export interface SubscribeFormProps extends HTMLFormAttributes {
		channels: SubscriptionChannel[];
	}
</script>

<script lang="ts">
	let { class: cls, channels: initialChannels, ...rest }: SubscribeFormProps = $props();
	const routing = RoutingContext.get();
	const { toaster } = NotificationContext.get();
	const { t } = Context.get();
	const globalLoading = LoadingContext.getGlobal();

	// set initial value
	subscribe.fields.channels.set(initialChannels);

	// handle turnstile
	let turnstileWidgetId: string | undefined = undefined;
	let turnstileObject: Turnstile | undefined = undefined;
	function handleTurnstile(e: CustomEvent<TurnstileEventDetail<{ token?: string }>>) {
		turnstileObject = e.detail.turnstile;
		turnstileWidgetId = e.detail.widgetId;
	}
	function resetTurnstile() {
		if (!turnstileObject || !turnstileWidgetId) return;
		turnstileObject.reset(turnstileWidgetId);
	}

	// handle checkbox that toggles all subscription channels
	const handleCheckAll: ChangeEventHandler<HTMLInputElement> = function (e) {
		subscribe.fields.channels.set(
			e.currentTarget.checked ? [...SUBSCRIPTION_CHANNELS] : initialChannels,
		);
	};
</script>

<form
	class={['space-y-6', cls]}
	{...rest}
	{...subscribe.enhance(async ({ submit }) => {
		const unload = globalLoading.load();
		try {
			await submit();
			resetTurnstile();
			if (subscribe.result?.success) {
				window.umami?.track('subscribe-newsletter-success', {
					action: subscribe.result.action,
					channels: subscribe.fields.channels.value(),
				});
				toaster.success({
					message: t({ key: 'domains.subscriber.subscribe.success' }),
				});
			}
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const appError = (error as any).body as App.Error;
			if ('code' in appError && 'message' in appError) {
				window.umami?.track('subscribe-newsletter-error', {
					code: appError.code,
					message: appError.message,
				});
				toaster.error({
					title: `${appError.code} - ${appError.message}`,
					message: t({ key: 'domains.subscriber.subscribe.errors.unknown' }),
				});
			}
		} finally {
			unload();
		}
	})}
>
	<div class="space-y-4">
		<!-- name -->
		<div class="space-y-1">
			<Issues name="name" issues={subscribe.fields.name.issues()} />
			<label class="c-text-input">
				<span class="min-w-12"><T key="inputs.name.label" />:</span>
				<input
					class="w-full"
					placeholder="Văn Vũ / Phương Phạm / ..."
					required
					{...subscribe.fields.name.as('text')}
					{...subscribe.fields.name.issues()?.length && {
						'aria-errormessage': 'error-name',
					}}
				/>
			</label>
		</div>

		<!-- email -->
		<div class="space-y-1">
			<Issues name="email" issues={subscribe.fields.email.issues()} />
			<label class="c-text-input">
				<span class="min-w-12">Email:</span>
				<input
					placeholder="email@example.com"
					required
					{...subscribe.fields.email.as('email')}
					{...subscribe.fields.email.issues()?.length && {
						'aria-errormessage': 'error-email',
					}}
				/>
			</label>
		</div>

		<!-- turnstile -->
		<div class="space-y-1">
			<div class="c-text-body-sm flex items-baseline justify-between gap-6">
				<p class=""><T key="inputs.turnstile.desc" />:</p>
				<Issues name="turnstile" issues={subscribe.fields.turnstile.issues()} />
			</div>
			<div
				class="turnstile border-onehalf border-current"
				use:turnstile
				turnstile-sitekey={VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
				turnstile-size="flexible"
				turnstile-response-field-name="turnstile"
				turnstile-response-field
				turnstile-language={routing.lang}
				onturnstile={handleTurnstile}
			>
				<!-- injected by @svelte-put/cloudflare-turnstile -->
			</div>
		</div>

		<!-- subscription channels -->
		<div>
			<select hidden {...subscribe.fields.channels.as('select multiple')}>
				{#each SUBSCRIPTION_CHANNELS as channel (channel)}
					<option value={channel}>{channel}</option>
				{/each}
			</select>
			<label class="flex cursor-pointer items-center gap-3">
				<input class="c-checkbox" type="checkbox" onchange={handleCheckAll} />
				<span>
					<T key="domains.subscriber.subscribe.all" />
				</span>
			</label>
		</div>
	</div>

	<!-- submit button -->
	<button class="c-btn c-btn--pop px-4" type="submit" disabled={!!subscribe.pending}>
		<span><T key="subscribe" /></span>
	</button>
</form>
