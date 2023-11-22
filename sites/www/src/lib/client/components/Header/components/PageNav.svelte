<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import { HEADER_PATHS, getPathLabel, isCurrentPage } from '$shared/services/navigation';

	export let pathname: string;
	let cls = '';
	export { cls as class };

	const langStore = getLangContext();
	$: lang = $langStore;
</script>

<nav aria-label="pages" data-sveltekit-preload-data="hover">
	<ul class="sp:divide-y sp:divide-outline {cls}">
		{#each HEADER_PATHS as href}
			{@const current = isCurrentPage(pathname, href)}
			<li data-current={current}>
				<a
					aria-current={current}
					{href}
					class="c-link c-link--preserved relative whitespace-nowrap uppercase sp:tp-h2@sp sp:block sp:p-4"
				>
					{getPathLabel(href, lang)}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="postcss">
	nav {
		display: contents;
	}

	ul {
		@screen sp {
			align-self: flex-start;
			margin-top: 80px;
			margin-right: -16px;
			margin-left: -16px;
		}

		@screen tb {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			display: flex;
			gap: 16px;
			align-items: center;
			justify-content: center;
		}

		@screen pc {
			gap: 40px;
		}
	}

	a {
		--underline-height: 2px;

		&:hover {
			color: var(--active-color);
		}

		&[aria-current]:not([aria-current='false']) {
			color: var(--active-color);
		}

		@media (768px <= width <= 850px) {
			font-size: calc(14 / 850 * 100vw);
		}
	}
</style>
