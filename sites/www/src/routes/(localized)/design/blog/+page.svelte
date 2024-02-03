<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';

	import '../../../../lib/css/code.css';

	import type { PageData } from './$types';
	import CodeBlock from './_page/components/CodeBlock.md.svelte?mdsvex';
	import CodeBlockDiff from './_page/components/CodeBlockDiff.md.svelte?mdsvex';
	import CodeBlockHighlight from './_page/components/CodeBlockHighlight.md.svelte?mdsvex';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main>
	<div class="heading-container max-w-pad">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="c-text-h2@sp font-medium uppercase tb:c-text-h1@pc">{t.title}</h1>
	</div>
	<div class="max-w-pad space-y-[60px] pb-40 pt-20">
		<section class="space-y-6" use:intersect>
			<h2 class="c-text-h2 font-medium">{t.typography.title}</h2>
			<p>{@html t.typography.description}</p>
		</section>

		<section>
			<div class="space-y-6">
				<h2 class="c-text-h2 font-medium" use:intersect>{t.codeblock.title}</h2>
				<p use:intersect>{@html t.codeblock.description}</p>
				<div class="prose max-w-full" use:intersect>
					<pre class="shiki github-dark-dimmed"><code
							><span class="line" data-line="1">```{t.codeblock.language}</span>
<span class="line" data-line="2">{t.codeblock.sourceCode}</span>
<span class="line" data-line="3">```</span></code
						></pre>
				</div>
				<p use:intersect>{t.codeblock.example}</p>
				<div class="prose max-w-full" use:intersect>
					<CodeBlock />
				</div>
				<p use:intersect>{@html t.codeblock.supportedLanguages}</p>
			</div>

			<section class="mt-10 space-y-6">
				<h3 class="c-text-h3 font-medium" use:intersect>Diff</h3>
				<p use:intersect>{t.codeblock.diff.description}</p>
				<div class="prose max-w-full" use:intersect>
					<pre class="shiki github-dark-dimmed"><code
							><span class="line" data-line="1">```javascript</span>
<span class="line" data-line="2">// :::diff -</span>
<span class="line" data-line="3">// export const OLD = 'old';</span>
<span class="line" data-line="4">// :::</span>
<span class="line" data-line="5">// :::diff +</span>
<span class="line" data-line="6">// export const NEW = 'new';</span>
<span class="line" data-line="7">// :::</span>
<span class="line" data-line="8">```</span></code
						></pre>
				</div>
				<p use:intersect>{t.codeblock.diff.example}:</p>
				<div class="prose max-w-full" use:intersect>
					<CodeBlockDiff />
				</div>
			</section>

			<section class="mt-10 space-y-6">
				<h3 class="c-text-h3 font-medium" use:intersect>Highlight</h3>
				<p use:intersect>{t.codeblock.highlight.description}</p>
				<div class="prose max-w-full" use:intersect>
					<pre class="shiki github-dark-dimmed"><code
							><span class="line" data-line="1">```javascript</span>
<span class="line" data-line="2">{'function handle({ event, resolve }) {'}</span>
<span class="line" data-line="3">  // :::highlight</span>
<code class="line" data-line="4">  console.log(event);</code>
<span class="line" data-line="5">  // :::</span>
<span class="line" data-line="6">  return resolve(event);</span>
<span class="line" data-line="7">{'}'}</span>
<span class="line" data-line="8">```</span></code
						></pre>
				</div>
				<p use:intersect>{t.codeblock.highlight.example}:</p>
				<div class="prose max-w-full" use:intersect>
					<CodeBlockHighlight />
				</div>
			</section>
		</section>

		<section>
			<h2 class="c-text-h2 font-medium" use:intersect>{t.components.title}</h2>
			<p class="mt-6" use:intersect>{t.components.description}</p>

			<section class="mt-10 space-y-6">
				<h3 class="c-text-h3 font-medium" use:intersect>{t.components.callout.title}</h3>
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
							><span class="line" data-line="1">:::div c-callout c-callout--info</span>
<span class="line" data-line="2">{t.components.callout.examples.info}</span>
<span class="line" data-line="3">:::</span></code
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
