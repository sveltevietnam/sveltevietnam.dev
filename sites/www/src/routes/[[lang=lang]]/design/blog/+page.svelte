<script lang="ts">
	import { intersect } from '$client/actions/intersect';
	import { Breadcrumbs } from '$client/components/Breadcrumbs';

	import type { PageData } from './$types';
	import CodeBlock from './_page/components/CodeBlock.md.svelte';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main>
	<div class="heading-container max-w-pad">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="tp-h2@sp font-medium uppercase tb:tp-h1@pc">{t.title}</h1>
	</div>
	<div class="space-y-[60px] pb-40 pt-20 max-w-pad">
		<section class="space-y-6" use:intersect>
			<h2 class="tp-h2 font-medium">{t.typography.title}</h2>
			<p>{@html t.typography.description}</p>
		</section>

		<section class="space-y-6">
			<h2 class="tp-h2 font-medium" use:intersect>{t.codeblock.title}</h2>
			<p use:intersect>{@html t.codeblock.description}</p>
			<div class="prose max-w-full" use:intersect>
				<pre class="shiki github-dark-dimmed"><code
						>```{t.codeblock.language}<br />{t.codeblock.sourceCode}<br />```</code
					></pre>
			</div>
			<p use:intersect>{t.codeblock.example}</p>
			<div class="prose max-w-full" use:intersect>
				<CodeBlock />
			</div>
			<p use:intersect>{@html t.codeblock.supportedLanguages}</p>
		</section>

		<section>
			<h2 class="tp-h2 font-medium" use:intersect>{t.components.title}</h2>
			<p class="mt-6" use:intersect>{t.components.description}</p>

			<section class="mt-10 space-y-6">
				<h3 class="tp-h3 font-medium" use:intersect>{t.components.callout.title}</h3>
				<p use:intersect>{t.components.callout.description}</p>
				<ul class="space-y-6">
					<li class="c-callout c-callout--info" use:intersect>
						{t.components.callout.examples.info}
					</li>
					<li class="c-callout c-callout--success" use:intersect>
						{t.components.callout.examples.success}
					</li>
					<li class="c-callout c-callout--warning" use:intersect>
						{t.components.callout.examples.warning}
					</li>
					<li class="c-callout c-callout--error" use:intersect>
						{t.components.callout.examples.error}
					</li>
				</ul>
				<p use:intersect>{@html t.components.callout.container}</p>
				<div class="prose max-w-full" use:intersect>
					<pre class="shiki github-dark-dimmed"><code
							>:::div c-callout c-callout--info<br />{t.components.callout.examples.info}<br
							/>:::</code
						></pre>
				</div>
			</section>
		</section>
	</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.neutral.DEFAULT');
	}
</style>
