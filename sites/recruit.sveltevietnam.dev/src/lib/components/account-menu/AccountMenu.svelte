<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import fallback1x1 from '@sveltevietnam/kit/assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';
	import { Dropdown } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import type { HTMLDetailsAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import { enhance } from '$app/forms';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';

	interface AccountMenuProps extends HTMLDetailsAttributes {
		image?: string | Picture | null;
		/** @bindable */
		open: boolean;
	}
</script>

<script lang="ts">
	let { image, open = $bindable(false), ...rest }: AccountMenuProps = $props();

	const { routing } = Contexts.get();

	let rImage = $derived(image ?? fallback1x1);

	const accountMenuItemClasses =
		'hover:bg-primary-surface flex cursor-pointer items-center gap-4 px-4 py-2 -outline-offset-1';
</script>

<Dropdown bind:open {...rest}>
	{#snippet label()}
		<span class="sr-only">
			<T message={m['components.account_menu.aria']} />
		</span>
		<enhanced:img
			class="aspect-square h-8 w-auto overflow-hidden rounded-full"
			src={rImage}
			alt=""
		/>
	{/snippet}

	{#snippet content()}
		<ul class="border-outline divide-outline bg-surface mt-0.5 w-max divide-y border">
			<li>
				<a class={accountMenuItemClasses} href={p['/:lang/profile']({ lang: routing.lang })}>
					<i class="i i-[ph--user] h-6 w-6"></i>
					<T message={m['components.account_menu.profile']} />
				</a>
			</li>
			<li>
				<form
					class="contents"
					action="{p['/:lang/login']({ lang: routing.lang })}?/logout"
					method="POST"
					use:enhance
				>
					<button class={accountMenuItemClasses} type="submit">
						<i class="i i-[ph--sign-out] h-6 w-6"></i>
						<T message={m['components.account_menu.logout']} />
					</button>
				</form>
			</li>
		</ul>
	{/snippet}
</Dropdown>
