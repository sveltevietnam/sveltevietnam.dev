<script lang="ts" module>
	import { LANGUAGES } from '@sveltevietnam/i18n';
	import { T } from '@sveltevietnam/i18n/runtime';
	import { delocalizeUrl } from '@sveltevietnam/i18n/utils';
	import fallback1x1 from '@sveltevietnam/kit/assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';
	import { Dropdown } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import type { HTMLDetailsAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';

	interface AccountMenuProps extends HTMLDetailsAttributes {
		image?: string | null;
		/** @bindable */
		open: boolean;
	}
</script>

<script lang="ts">
	let { image, open = $bindable(false), ...rest }: AccountMenuProps = $props();

	const { routing } = Contexts.get();

	const accountMenuItemClasses =
		'hover:bg-primary-surface flex cursor-pointer items-center gap-4 px-4 py-2 -outline-offset-1';
	const imageClasses = 'aspect-square h-8 w-auto overflow-hidden rounded-full';

	function closeMenu() {
		open = false;
	}
</script>

<Dropdown bind:open {...rest} role="navigation" aria-labelledby="account-menu-label">
	{#snippet label()}
		<span class="sr-only" id="account-menu-label">
			<T message={m['components.account_menu.aria']} />
		</span>
		{#if image}
			<img class={imageClasses} src={image} alt="" width="32" height="32" />
		{:else}
			<enhanced:img
				class="aspect-square h-8 w-auto overflow-hidden rounded-full"
				src={fallback1x1}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet content()}
		{@const profilePath = p['/:lang/profile']({ lang: routing.lang })}
		{@const logoutPath = p['/:lang/logout']({ lang: routing.lang })}

		<ul class="border-outline divide-outline bg-surface mt-0.5 w-max divide-y border">
			<li>
				<a
					class={accountMenuItemClasses}
					href={profilePath}
					onclick={closeMenu}
					data-umami-event="click-navigation-link"
					data-umami-event-position="account-menu"
					data-umami-event-path={delocalizeUrl(profilePath, LANGUAGES)}
				>
					<i class="i i-[ph--user] h-6 w-6"></i>
					<T message={m['components.account_menu.profile']} />
				</a>
			</li>
			<li>
				<a
					class={accountMenuItemClasses}
					href={logoutPath}
					onclick={closeMenu}
					data-umami-event="click-navigation-link"
					data-umami-event-position="account-menu"
					data-umami-event-path={delocalizeUrl(logoutPath, LANGUAGES)}
				>
					<i class="i i-[ph--sign-out] h-6 w-6"></i>
					<T message={m['components.account_menu.logout']} />
				</a>
			</li>
		</ul>
	{/snippet}
</Dropdown>
