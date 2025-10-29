<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { enhanceDialog } from '@svelte-put/async-stack/helpers';
	import { shortcut } from '@svelte-put/shortcut';
	import { T } from '@sveltevietnam/i18n-new';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import sanitize from 'sanitize-html';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { SearchContext } from '$lib/search/context.svelte';

	let { item }: StackItemProps = $props();
	const {
		i18n: { t },
	} = Contexts.get();
	const search = SearchContext.get();

	let queryEl: HTMLInputElement;
	let dialog: HTMLDialogElement;

	function clear(e: MouseEvent) {
		e.preventDefault();
		search.query = '';
		queryEl.focus();
	}

	function closeDialog() {
		dialog.requestClose();
	}

	const commonItemClasses =
		'interactive border-b-outline hover:outline-outline-focus hover:outline';

	onMount(() => {
		window.dispatchEvent(new CustomEvent('searchopen', { detail: { query: search.query } }));
		item.resolution.then(() => {
			window.dispatchEvent(new CustomEvent('searchclose', { detail: { query: search.query } }));
		});
	});
</script>

<dialog
	{...enhanceDialog(item, { delayResolution: 'animationend' })}
	class="c-dialog bg-surface-subtle mt-header mobile:m-0 mobile:w-full mobile:h-full mobile:shadow-none
	tablet:max-h-[80vh] max-h-screen max-w-screen p-0"
	bind:this={dialog}
	use:shortcut={{
		trigger: { key: 'k', modifier: ['ctrl', 'meta'], callback: closeDialog },
	}}
	aria-labelledby="search-dialog-label"
>
	<p class="sr-only" id="search-dialog-label">
		<T key="search" />
	</p>
	<search class="flex h-full min-h-50 w-150 max-w-full flex-col">
		<!-- query -->
		<form class="border-outline relative flex max-w-full items-center gap-2 border-b p-4">
			<label class="c-text-input bg-surface relative min-w-0 flex-1">
				<span class="sr-only">
					<T key="dialogs.search.input.label" />
				</span>
				<i class="i i-[ph--magnifying-glass] h-6 w-6"></i>
				<input
					type="text"
					placeholder={await t({ key: 'dialogs.search.input.placeholder' })}
					bind:value={search.query}
					bind:this={queryEl}
				/>
				{#if search.query}
					<button
						class="c-btn c-btn--icon absolute top-1/2 right-2 -translate-y-1/2"
						type="button"
						onclick={clear}
						transition:fade={{ duration: 150 }}
					>
						<span class="sr-only">
							<T key="dialogs.search.input.clear" />
						</span>
						<i class="i i-[ph--x] h-6 w-6"></i>
					</button>
				{/if}
			</label>
			<button class="c-btn c-btn--outlined mobile:block hidden" formmethod="dialog">
				<span><T key="dialogs.search.input.exit" /></span>
			</button>
		</form>

		<!-- results -->
		<output class="tablet:min-h-[20vh] flex flex-1 flex-col">
			{#if search.results}
				<svelte:boundary>
					{@const results = await search.results}
					{#snippet pending()}
						<p class="p-4"><T key="dialogs.search.results.searching" /></p>
					{/snippet}
					{#if results.length}
						{@const maybeClippedResults = search.clip.results ? results.slice(0, 3) : results}
						<div class="tablet:max-h-[60vh] space-y-4 overflow-auto p-4">
							<p>
								<T
									key="dialogs.search.results.found"
									params={{ count: results.length.toString() }}
								/>
							</p>
							<ul class="space-y-6">
								{#each maybeClippedResults as result (result.id)}
									{@const subResults = search.clip.subResults[result.id]
										? result.subResults.slice(0, 3)
										: result.subResults}
									<li class="bg-surface border-outline border border-b-0">
										<a
											class={['flex items-center gap-4 border-b p-3', commonItemClasses]}
											href={result.url}
											onclick={closeDialog}
										>
											<i class="i i-[ph--file-text] h-6 w-6"></i>
											<strong>{result.title}</strong>
										</a>
										<ul class="">
											{#each subResults as subResult (subResult.id)}
												<li class="_subresult relative">
													<a
														class={['block space-y-2 border-b py-3 pr-6 pl-13', commonItemClasses]}
														href={subResult.url}
														onclick={closeDialog}
													>
														<p class="c-text-body-sm font-medium">{subResult.title}</p>
														<!-- eslint-disable-next-line svelte/no-at-html-tags -->
														<p class="c-text-body-xs text-on-surface-dim leading-relaxed">
															<!-- eslint-disable-next-line svelte/no-at-html-tags -->
															{@html sanitize(subResult.excerpt)}
														</p>
													</a>
												</li>
											{/each}
										</ul>
										{#if search.clip.subResults[result.id]}
											<label
												class={[
													'c-text-body-sm text-on-surface-dim relative block w-full cursor-pointer border-b py-2 pr-6 pl-13',
													commonItemClasses,
												]}
											>
												<input
													class="sr-only"
													type="checkbox"
													bind:checked={search.clip.subResults[result.id]}
													onclick={(e) => e.stopPropagation()}
												/>
												<span>
													<T key="dialogs.search.results.clip.sub_results" />
												</span>
											</label>
										{/if}
									</li>
								{/each}
							</ul>
							{#if search.clip.results}
								<label
									class={[
										'c-text-body-sm bg-surface border-outline block cursor-pointer border p-2 text-center',
										commonItemClasses,
									]}
								>
									<input class="sr-only" type="checkbox" bind:checked={search.clip.results} />
									<span>
										<T key="dialogs.search.results.clip.results" />
									</span>
								</label>
							{/if}
						</div>
					{:else}
						<p class="p-4">
							<T key="dialogs.search.results.none" />
						</p>
					{/if}
				</svelte:boundary>
			{:else}
				<div class="p-4">
					<svg
						class="text-surface-variant mx-auto my-7.5 h-auto w-1/2 justify-self-center opacity-40"
						inline-src="blocks"
						aria-hidden="true"
					>
					</svg>
				</div>
			{/if}
		</output>

		<div class="border-outline border-t p-4 py-2">
			<p class="c-text-body-sm text-right">
				<T key="dialogs.search.footer" />
			</p>
		</div>
	</search>
</dialog>

<style lang="postcss">
	._subresult {
		&::before {
			pointer-events: none;
			content: '';

			position: absolute;
			z-index: 1;
			inset-block: 0;
			inset-inline-start: 0.5rem;

			width: 2rem;

			background-color: var(--color-outline);

			mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' viewBox='0 0 16 1000' preserveAspectRatio='xMinYMin slice'%3E%3Cpath d='M8 0v1000m6-988H8'/%3E%3C/svg%3E");
			mask-repeat: no-repeat;
			mask-size: 100%;
		}

		&:last-child::before {
			mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 16 16'%3E%3Cpath d='M8 0v12m6 0H8'/%3E%3C/svg%3E");
		}
	}
</style>
