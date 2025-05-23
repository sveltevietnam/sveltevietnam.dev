<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let {
		crumbs,
		scrollIndicator = 'blur',
		...rest
	}: HTMLAttributes<HTMLElement> & {
		crumbs: { path: string; name: string }[];
		scrollIndicator?: 'blur' | 'ellipsis';
	} = $props();

	const settings = SettingsContext.get();

	let scrollableLeft = $state(true);
	let scrollableRight = $state(true);
	let scrollable = $state(false);

	let ol: HTMLOListElement;
	const PAD = 10;
	function checkScrollable() {
		scrollable = ol.scrollWidth > ol.offsetWidth;
		scrollableLeft = ol.scrollLeft > PAD;
		scrollableRight = ol.scrollLeft + ol.offsetWidth < ol.scrollWidth - PAD;
	}

	onMount(checkScrollable);
</script>

<nav
	aria-label={m['components.breadcrumbs.aria'](settings.language)}
	data-scrollable={scrollable}
	data-scrollable-left={scrollableLeft}
	data-scrollable-right={scrollableRight}
	data-scrollable-indicator={scrollIndicator}
	{...rest}
>
	<ol
		class="scrollbar-hidden flex items-center gap-2 overflow-auto"
		bind:this={ol}
		onscroll={checkScrollable}
	>
		{#each crumbs as { name, path }, i (name)}
			{@const current = i === crumbs.length - 1}
			<li class="contents">
				<a class={[!current && 'c-link-lazy']} aria-current={current} href={path}>
					{#if i === 0}
						<i class="i i-[ph--house-line] h-6 w-6"></i>
						<span class="sr-only">
							<T message={m['components.breadcrumbs.home']} />
						</span>
					{:else}
						<span class="whitespace-nowrap">{name}</span>
					{/if}
				</a>
				{#if !current}
					<i class="i i-[ph--caret-right] h-4 w-4 shrink-0"></i>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style lang="postcss">
	nav {
		margin-right: calc(-1 * var(--container-padding-x));
		margin-left: calc(-1 * var(--container-padding-x));
	}

	ol {
		padding-right: var(--container-padding-x);
		padding-left: var(--container-padding-x);
	}

	nav[data-scrollable]:not([data-scrollable='false']) {
		--blur-background-from: var(--color-bg, var(--color-primary-surface));
		--blur-background-to: rgb(0 0 0 / 0%);

		position: relative;

		&::before,
		&::after {
			pointer-events: none;

			position: absolute;
			z-index: 2;
			top: 0;
			bottom: 0;

			display: block;

			opacity: 0;

			transition: opacity 200ms ease;
		}

		&[data-scrollable-indicator='blur'] {
			&::before,
			&::after {
				content: '';
				width: 132px;
			}

			&::before {
				left: -16px;
				background: linear-gradient(
					270deg,
					var(--blur-background-to) 0%,
					var(--blur-background-from) 86.2%
				);
			}

			&::after {
				right: -16px;
				background: linear-gradient(
					270deg,
					var(--blur-background-from) 0%,
					var(--blur-background-to) 86.2%
				);
			}
		}

		&[data-scrollable-indicator='ellipsis'] {
			&::before {
				content: '...';
				right: 100%;
			}

			&::after {
				content: '...';
				left: 100%;
			}
		}

		&[data-scrollable-left='true']::before {
			opacity: 1;
		}

		&[data-scrollable-right='true']::after {
			opacity: 1;
		}
	}
</style>
