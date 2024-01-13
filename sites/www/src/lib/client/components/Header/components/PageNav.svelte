<script lang="ts">
	import { getNavigationContext } from '$client/contexts/navigation';

	let cls = '';
	export { cls as class };

	const { routes, is } = getNavigationContext();

	$: headerRoutes = [
		$routes.events,
		$routes.blog,
		$routes.jobs,
		// $routes.impact,
		// $routes.people,
		$routes.sponsor,
	];
</script>

<nav aria-label="pages" data-sveltekit-preload-data="hover">
	<ul class="sp:divide-y sp:divide-outline {cls}">
		{#each headerRoutes as { label, path }}
			{@const current = $is(path)}
			<li data-current={current}>
				<a
					aria-current={current}
					href={path}
					class="c-link c-link--preserved relative whitespace-nowrap uppercase sp:c-text-h2@sp sp:block sp:p-4"
				>
					{label}
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
		--transition-duration: 250ms;

		@media (768px <= width <= 850px) {
			font-size: calc(14 / 850 * 100vw);
		}
	}
</style>
