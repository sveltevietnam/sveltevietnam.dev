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
	import type { KeySimple } from '@sveltevietnam/i18n/generated';
	import { LANGUAGES } from '@sveltevietnam/kit/constants';
	import { RoutingContext, NotificationContext, LoadingContext } from '@sveltevietnam/kit/contexts';
	import type { HTMLFormAttributes } from 'svelte/elements';

	import { VITE_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
	import Issues from '$lib/domains/common/FormIssues.svelte';

	import { getSubscription, updateSubscription } from './functions.remote';

	export interface UpdateSubscriptionFormProps extends HTMLFormAttributes {
		subscriberId: string;
	}
</script>

<script lang="ts">
	let { subscriberId, class: cls, ...rest }: UpdateSubscriptionFormProps = $props();
	const routing = RoutingContext.get();
	const { toaster } = NotificationContext.get();
	const { t } = Context.get();
	const globalLoading = LoadingContext.getGlobal();

	// fetch subscription value & set form initial value
	const subscription = await getSubscription(subscriberId);
	updateSubscription.fields.set(subscription);

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

	// variables used for markup
	let languageNames = $derived(new Intl.DisplayNames([routing.lang], { type: 'language' }));
	const channelMessages = {
		job: 'domains.subscriber.update_subscription.inputs.channels.job',
		blog: 'domains.subscriber.update_subscription.inputs.channels.blog',
		event: 'domains.subscriber.update_subscription.inputs.channels.event',
	} as Record<SubscriptionChannel, KeySimple>;
	const commonFieldsetClasses = 'border-onehalf space-y-4 pb-4 px-2 tablet:px-4 pt-0';
</script>

<form
	class={['space-y-6', cls]}
	{...rest}
	{...updateSubscription.enhance(async ({ submit }) => {
		const unload = globalLoading.load();
		try {
			await submit();
			resetTurnstile();
			if (updateSubscription.result?.success) {
				window.umami?.track('update-subscription-success');
				toaster.success({
					message: t({ key: 'domains.subscriber.update_subscription.success' }),
				});
			}
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const appError = (error as any).body as App.Error;
			if ('code' in appError && 'message' in appError) {
				window.umami?.track('update-subscription-error', {
					code: appError.code,
					message: appError.message,
				});
				toaster.error({
					title: `${appError.code} - ${appError.message}`,
					message: t({ key: 'domains.subscriber.update_subscription.errors.unknown' }),
				});
			}
		} finally {
			unload();
		}
	})}
>
	<div class="space-y-4">
		<!-- hidden id input, for convenience and avoid joining -->
		<input {...updateSubscription.fields.id.as('text')} hidden required />

		<!-- personal information -->
		<fieldset class={commonFieldsetClasses}>
			<legend>
				<T key="domains.subscriber.update_subscription.inputs.personal.heading" />
			</legend>

			<!-- name -->
			<div class="space-y-1">
				<Issues name="name" issues={updateSubscription.fields.name.issues()} />
				<label class="c-text-input">
					<span class="min-w-12"><T key="inputs.name.label" />:</span>
					<input
						class=" w-full"
						placeholder="Văn Vũ / Phương Phạm / ..."
						required
						{...updateSubscription.fields.name.as('text')}
						{...updateSubscription.fields.name.issues() && {
							'aria-errormessage': 'error-name',
						}}
					/>
				</label>
			</div>

			<!-- email -->
			<div class="space-y-1">
				<label class="c-text-input">
					<Issues name="email" issues={updateSubscription.fields.email.issues()} />
					<span class="min-w-12">Email:</span>
					<input
						placeholder="email@example.com"
						required
						{...updateSubscription.fields.email.as('text')}
						{...updateSubscription.fields.email.issues() && {
							'aria-errormessage': 'error-email',
						}}
					/>
				</label>
			</div>
		</fieldset>

		<!-- languages -->
		<fieldset class={commonFieldsetClasses}>
			<legend>
				<T key="domains.subscriber.update_subscription.inputs.language.heading" />
			</legend>
			<p><T key="domains.subscriber.update_subscription.inputs.language.desc" />:</p>
			<ul class="flex items-center gap-10 pl-2">
				{#each LANGUAGES as lang (lang)}
					<li>
						<label class="flex cursor-pointer items-center gap-2">
							<input
								class="c-radio"
								{...updateSubscription.fields.language.as('radio', lang)}
								{...updateSubscription.fields.language.issues() && {
									'aria-errormessage': 'error-language',
								}}
							/>
							<span>{languageNames.of(lang)}</span>
						</label>
					</li>
				{/each}
			</ul>
			<Issues name="email" issues={updateSubscription.fields.language.issues()} />
		</fieldset>

		<!-- notification channels -->
		<fieldset class={commonFieldsetClasses}>
			<legend>
				<T key="domains.subscriber.update_subscription.inputs.channels.heading" />
			</legend>
			<p><T key="domains.subscriber.update_subscription.inputs.channels.desc" />:</p>
			<ul class="space-y-2 pl-2">
				{#each SUBSCRIPTION_CHANNELS as channel (channel)}
					<li>
						<label class="flex cursor-pointer items-center gap-3">
							<input
								class="c-checkbox"
								{...updateSubscription.fields.channels.as('checkbox', channel)}
								{...updateSubscription.fields.channels.issues() && {
									'aria-errormessage': 'error-channels',
								}}
							/>
							<span>
								<T key={channelMessages[channel]} />
							</span>
						</label>
					</li>
				{/each}
			</ul>
			<Issues name="email" issues={updateSubscription.fields.channels.issues()} />
		</fieldset>

		<!-- turnstile -->
		<div class="space-y-1">
			<div class="c-text-body-sm flex items-baseline justify-between gap-6">
				<p class=""><T key="inputs.turnstile.desc" />:</p>
				<Issues name="turnstile" issues={updateSubscription.fields.turnstile.issues()} />
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
	</div>

	<button class="c-btn c-btn--pop px-4" type="submit" disabled={!!updateSubscription.pending}>
		<span><T key="update" /></span>
	</button>
</form>
