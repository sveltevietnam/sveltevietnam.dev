<script lang="ts">
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { intersect } from '$lib/actions/intersect';

	import type { PageData } from './$types';

	export let data: PageData;

	const TYPOGRAPHY = [
		{
			name: 'H1',
			class: 'c-text-h1',
			fontFamily: 'Lora',
			sp: {
				class: 'c-text-h1@sp',
				fontSize: '3rem',
				lineHeight: '1.25',
				letterSpacing: '4%',
			},
			pc: {
				class: 'c-text-h1@pc',
				fontSize: '4rem',
				lineHeight: '1.2813',
				letterSpacing: '6%',
			},
			example: 'Heading 1',
		},
		{
			name: 'H2',
			class: 'c-text-h2',
			fontFamily: 'Lora',
			sp: {
				class: 'c-text-h2@sp',
				fontSize: '2rem',
				lineHeight: '1.2813',
				letterSpacing: '4%',
			},
			pc: {
				class: 'c-text-h2@pc',
				fontSize: '3rem',
				lineHeight: '1.25',
				letterSpacing: '4%',
			},
			example: 'Heading 2',
		},
		{
			name: 'H3',
			class: 'c-text-h3',
			fontFamily: 'Lora',
			sp: {
				class: 'c-text-h3@sp',
				fontSize: '1.4rem',
				lineHeight: '1.5',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-h3@pc',
				fontSize: '2rem',
				lineHeight: '1.2813',
				letterSpacing: '4%',
			},
			example: 'Heading 3',
		},
		{
			name: 'H4',
			class: 'c-text-h4',
			fontFamily: 'Inter',
			sp: {
				class: 'c-text-h4@sp',
				fontSize: '1.25rem',
				lineHeight: '1.2',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-h4@pc',
				fontSize: '1.5rem',
				lineHeight: '1.292',
				letterSpacing: '0%',
			},
			example: 'Heading 4',
		},
		{
			name: 'H5',
			class: 'c-text-h5',
			fontFamily: 'Inter',
			sp: {
				class: 'c-text-h5@sp',
				fontSize: '1.125rem',
				lineHeight: '1.333',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-h5@pc',
				fontSize: '1.125rem',
				lineHeight: '1.333',
				letterSpacing: '0%',
			},
			example: 'Heading 5',
		},
		{
			name: 'Body 1',
			class: 'c-text-body1',
			fontFamily: 'Inter',
			sp: {
				class: 'c-text-body1@sp',
				fontSize: '1rem',
				lineHeight: '1.5',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-body1@pc',
				fontSize: '1rem',
				lineHeight: '1.5',
				letterSpacing: '0%',
			},
			example: 'Body 1',
		},
		{
			name: 'Body 2',
			class: 'c-text-body2',
			fontFamily: 'Inter',
			sp: {
				class: 'c-text-body2@sp',
				fontSize: '0.875rem',
				lineHeight: '1.714',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-body2@pc',
				fontSize: '0.875rem',
				lineHeight: '1.714',
				letterSpacing: '0%',
			},
			example: 'Body 2',
		},
		{
			name: 'Caption 1',
			class: 'c-text-cap1',
			fontFamily: 'Inter',
			sp: {
				class: 'c-text-cap1@sp',
				fontSize: '0.875rem',
				lineHeight: '1.571',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-cap1@pc',
				fontSize: '0.875rem',
				lineHeight: '1.571',
				letterSpacing: '0%',
			},
			example: 'Caption 1',
		},
		{
			name: 'Caption 2',
			class: 'c-text-cap2',
			fontFamily: 'Inter',
			sp: {
				class: 'c-text-cap2@sp',
				fontSize: '0.75rem',
				lineHeight: '1.833',
				letterSpacing: '0%',
			},
			pc: {
				class: 'c-text-cap2@pc',
				fontSize: '0.75rem',
				lineHeight: '1.833',
				letterSpacing: '0%',
			},
			example: 'Caption 2',
		},
	];

	$: t = data.translations.page;
</script>

<main class="c-text-body1">
	<div class="heading-container max-w-pad">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="c-text-h2@sp font-medium uppercase tb:c-text-h1@pc">{t.title}</h1>
	</div>
	<div class="max-w-pad pb-40 pt-20">
		{#each TYPOGRAPHY as typo, i (typo.name)}
			{#if i > 0}
				<div class="my-12 h-px w-full bg-outline" />
			{/if}
			<section use:intersect>
				<div class="grid grid-cols-[1fr,auto,auto] gap-x-8 gap-y-1">
					<div class="contents">
						<p class="font-medium">Name</p>
						<h2 class="col-span-2 text-right font-bold">{typo.name}</h2>
					</div>
					<div class="contents">
						<p class="font-medium">Font family</p>
						<p class="col-span-2 text-right">{typo.fontFamily}</p>
					</div>
					<div class="contents">
						<p class="font-medium">Reactive CSS</p>
						<p class="col-span-2 text-right"><code>{typo.class}</code></p>
					</div>
					<div class="col-span-3 flex justify-between font-bold"></div>
					<div class="contents font-medium">
						<div class="mt-4 font-bold"></div>
						<p class="mt-4">Desktop</p>
						<p class="mt-4 text-right">Mobile</p>
					</div>
					<div class="contents">
						<p class="font-medium">Specific CSS</p>
						<p><code>{typo.pc.class}</code></p>
						<p><code>{typo.sp.class}</code></p>
					</div>
					<div class="contents">
						<p class="font-medium">Font size</p>
						<p>{typo.pc.fontSize}</p>
						<p class="text-right">{typo.sp.fontSize}</p>
					</div>
					<div class="contents">
						<p class="font-medium">Line height</p>
						<p>{typo.pc.lineHeight}</p>
						<p class="text-right">{typo.sp.lineHeight}</p>
					</div>
					<div class="contents">
						<p class="font-medium">Letter spacing</p>
						<p>{typo.pc.letterSpacing}</p>
						<p class="text-right">{typo.sp.letterSpacing}</p>
					</div>
				</div>
				<ul
					class="{typo.class} flex h-full flex-col items-center justify-center border p-4 text-right tb:text-center"
				>
					{#each ['font-bold', 'font-medium', 'font-normal'] as weight}
						<li class={weight}>{typo.example}</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.neutral.DEFAULT');
	}

	section {
		display: grid;
		grid-template-columns: 1fr;
		gap: 40px;
		align-items: flex-start;

		@screen sp {
			grid-template-rows: auto auto;
		}

		@screen tb {
			grid-template-columns: 400px 1fr;
			gap: 80px;
		}

		@screen pc {
			gap: 100px;
		}
	}
</style>
